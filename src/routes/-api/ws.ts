import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";

export const wsRoute = new Hono().get(
  "",
  upgradeWebSocket((_c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server!");
      },
      onClose: () => {
        console.log("Connection closed");
      },
      onOpen: () => {
        console.log("Connection opened");
      },
    };
  }),
);
