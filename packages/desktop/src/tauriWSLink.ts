import { Operation, TRPCClientError, TRPCLink } from "@trpc/client";
import type { Observer, UnsubscribeFn } from "@trpc/server/observable";
import { observable } from "@trpc/server/observable";
import type {
  AnyRouter,
  inferRouterError,
  MaybePromise,
  ProcedureType,
  TRPCClientIncomingMessage,
  TRPCClientIncomingRequest,
  TRPCClientOutgoingMessage,
  TRPCRequestMessage,
  TRPCResponseMessage,
} from "@trpc/server/unstable-core-do-not-import";
import { transformResult } from "@trpc/server/unstable-core-do-not-import";
import TauriWebsocket from "@tauri-apps/plugin-websocket";

const run = <TResult>(fn: () => TResult): TResult => fn();

type WSCallbackResult<TRouter extends AnyRouter, TOutput> = TRPCResponseMessage<
  TOutput,
  inferRouterError<TRouter>
>;

type WSCallbackObserver<TRouter extends AnyRouter, TOutput> = Observer<
  WSCallbackResult<TRouter, TOutput>,
  TRPCClientError<TRouter>
>;

const exponentialBackoff = (attemptIndex: number) =>
  attemptIndex === 0 ? 0 : Math.min(1000 * 2 ** attemptIndex, 30000);

export interface WebSocketClientOptions {
  /**
   * The URL to connect to (can be a function that returns a URL)
   */
  url: string | (() => MaybePromise<string>);
  /**
   * Ponyfill which WebSocket implementation to use
   */
  // WebSocket?: typeof WebSocket;
  /**
   * The number of milliseconds before a reconnect is attempted.
   * @default {@link exponentialBackoff}
   */
  retryDelayMs?: typeof exponentialBackoff;
  /**
   * Triggered when a WebSocket connection is established
   */
  onOpen?: () => void;
  /**
   * Triggered when a WebSocket connection is closed
   */
  onClose?: (cause?: { code?: number }) => void;
}

export function createWSClient(opts: WebSocketClientOptions) {
  const {
    url,
    // WebSocket: WebSocketImpl = WebSocket,
    retryDelayMs: retryDelayFn = exponentialBackoff,
    onOpen,
  } = opts;

  /**
   * outgoing messages buffer whilst not open
   */
  let outgoing: TRPCClientOutgoingMessage[] = [];
  /**
   * pending outgoing requests that are awaiting callback
   */
  type TCallbacks = WSCallbackObserver<AnyRouter, unknown>;
  type TRequest = {
    /**
     * Reference to the WebSocket instance this request was made to
     */
    connection: Connection | null;
    type: ProcedureType;
    callbacks: TCallbacks;
    op: Operation;
  };
  const pendingRequests: Record<number | string, TRequest> =
    Object.create(null);
  let connectAttempt = 0;
  let connectTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  let connectionIndex = 0;
  let activeConnection: null | Connection = createConnection();

  type Connection = {
    id: number;
  } & (
    | {
        state: "open";
        ws: TauriWebsocket;
      }
    | {
        state: "closed";
        ws: TauriWebsocket;
      }
    | {
        state: "connecting";
        ws?: TauriWebsocket;
      }
  );

  /**
   * tries to send the list of messages
   */
  function dispatch() {
    if (!activeConnection) {
      activeConnection = createConnection();
      return;
    }
    // using a timeout to batch messages
    setTimeout(() => {
      if (activeConnection?.state !== "open") {
        return;
      }
      for (const pending of Object.values(pendingRequests)) {
        if (!pending.connection) {
          pending.connection = activeConnection;
        }
      }
      if (outgoing.length === 1) {
        // single send
        activeConnection.ws.send(JSON.stringify(outgoing.pop()));
      } else {
        // batch send
        activeConnection.ws.send(JSON.stringify(outgoing));
      }
      // clear
      outgoing = [];
    });
  }
  function tryReconnect(conn: Connection) {
    if (connectTimer) {
      return;
    }

    conn.state = "connecting";
    const timeout = retryDelayFn(connectAttempt++);
    reconnectInMs(timeout);
  }
  function hasPendingRequests(conn?: Connection) {
    const requests = Object.values(pendingRequests);
    if (!conn) {
      return requests.length > 0;
    }
    return requests.some((req) => req.connection === conn);
  }

  function reconnect() {
    const oldConnection = activeConnection;
    activeConnection = createConnection();
    oldConnection && closeIfNoPending(oldConnection);
  }
  function reconnectInMs(ms: number) {
    if (connectTimer) {
      return;
    }
    connectTimer = setTimeout(reconnect, ms);
  }

  function closeIfNoPending(conn: Connection) {
    // disconnect as soon as there are are no pending requests
    if (!hasPendingRequests(conn)) {
      conn.ws?.disconnect();
    }
  }
  function resumeSubscriptionOnReconnect(req: TRequest) {
    if (outgoing.some((r) => r.id === req.op.id)) {
      return;
    }
    request(req.op, req.callbacks);
  }

  function createConnection(): Connection {
    const self: Connection = {
      id: ++connectionIndex,
      state: "connecting",
    } as Connection;

    const onError = (e: any) => {
      console.error("error", e);
      self.state = "closed";
      if (self === activeConnection) {
        tryReconnect(self);
      }
    };
    run(async () => {
      const urlString = typeof url === "function" ? await url() : url;
      console.log("connecting to", urlString);
      const ws = await TauriWebsocket.connect(urlString);
      console.log("connected to", urlString);
      self.ws = ws;
      connectAttempt = 0;
      self.state = "open";

      onOpen?.();
      dispatch();

      const handleIncomingRequest = (req: TRPCClientIncomingRequest) => {
        if (self !== activeConnection) {
          return;
        }

        if (req.method === "reconnect") {
          reconnect();
          // notify subscribers
          for (const pendingReq of Object.values(pendingRequests)) {
            if (pendingReq.type === "subscription") {
              resumeSubscriptionOnReconnect(pendingReq);
            }
          }
        }
      };
      const handleIncomingResponse = (data: TRPCResponseMessage) => {
        const req = data.id !== null && pendingRequests[data.id];
        if (!req) {
          // do something?
          return;
        }

        req.callbacks.next?.(data);
        if (self === activeConnection && req.connection !== activeConnection) {
          // gracefully replace old connection with this
          const oldConn = req.connection;
          req.connection = self;
          oldConn && closeIfNoPending(oldConn);
        }

        if (
          "result" in data &&
          data.result.type === "stopped" &&
          activeConnection === self
        ) {
          req.callbacks.complete();
        }
      };
      ws.addListener(({ data }) => {
        if (typeof data !== "string") {
          return;
        }

        const msg = JSON.parse(data) as TRPCClientIncomingMessage;

        if ("method" in msg) {
          handleIncomingRequest(msg);
        } else {
          handleIncomingResponse(msg);
        }
        if (self !== activeConnection) {
          // when receiving a message, we close old connection that has no pending requests
          closeIfNoPending(self);
        }
      });
    }).catch(onError);
    return self;
  }

  function request(op: Operation, callbacks: TCallbacks): UnsubscribeFn {
    const { type, input, path, id } = op;
    const envelope: TRPCRequestMessage = {
      id,
      method: type,
      params: {
        input,
        path,
      },
    };
    pendingRequests[id] = {
      connection: null,
      type,
      callbacks,
      op,
    };

    // enqueue message
    outgoing.push(envelope);

    dispatch();

    return () => {
      const callbacks = pendingRequests[id]?.callbacks;
      delete pendingRequests[id];
      outgoing = outgoing.filter((msg) => msg.id !== id);

      callbacks?.complete?.();
      if (activeConnection?.state === "open" && op.type === "subscription") {
        outgoing.push({
          id,
          method: "subscription.stop",
        });
        dispatch();
      }
    };
  }
  return {
    close: () => {
      connectAttempt = 0;

      for (const req of Object.values(pendingRequests)) {
        if (req.type === "subscription") {
          req.callbacks.complete();
        } else if (!req.connection) {
          // close pending requests that aren't attached to a connection yet
          req.callbacks.error(
            TRPCClientError.from(
              new Error("Closed before connection was established")
            )
          );
        }
      }
      activeConnection && closeIfNoPending(activeConnection);
      clearTimeout(connectTimer);
      connectTimer = undefined;
      activeConnection = null;
    },
    request,
    get connection() {
      return activeConnection;
    },
  };
}
export type TRPCWebSocketClient = ReturnType<typeof createWSClient>;

export interface WebSocketLinkOptions {
  client: TRPCWebSocketClient;
}
class TRPCWebSocketClosedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TRPCWebSocketClosedError";
    Object.setPrototypeOf(this, TRPCWebSocketClosedError.prototype);
  }
}

/**
 * @link https://trpc.io/docs/v11/client/links/wsLink
 */
export function tauriWsLink<TRouter extends AnyRouter>(
  opts: WebSocketLinkOptions
): TRPCLink<TRouter> {
  return (runtime) => {
    const { client } = opts;
    return ({ op }) => {
      return observable((observer) => {
        const { type, path, id, context } = op;

        const input = runtime.transformer.serialize(op.input);

        const unsub = client.request(
          { type, path, input, id, context },
          {
            error(err) {
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              observer.error(err as TRPCClientError<any>);
              console.error("error", err);
              unsub();
            },
            complete() {
              observer.complete();
            },
            next(message) {
              const transformed = transformResult(message, runtime.transformer);

              if (!transformed.ok) {
                observer.error(TRPCClientError.from(transformed.error));
                return;
              }
              observer.next({
                result: transformed.result,
              });

              if (op.type !== "subscription") {
                // if it isn't a subscription we don't care about next response

                unsub();
                observer.complete();
              }
            },
          }
        );
        return () => {
          unsub();
        };
      });
    };
  };
}
