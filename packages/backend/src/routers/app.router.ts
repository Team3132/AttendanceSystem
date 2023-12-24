import z from "zod";
import { t } from "../trpc";
import { botRouter } from "./bot.router";
import { authRouter } from "./auth.router";
import { publicProcedure } from "../trpc/utils";
import { eventRouter as eventsRouter } from "./events.router";
import { outreachRouter } from "./outreach.router";
import { userRouter as usersRouter } from "./users.router";
import { EventEmitter } from "eventemitter3";
import { observable } from "@trpc/server/observable";
import { createTRPCReact, getQueryKey } from "@trpc/react-query";

interface IEventEmitter {
  invalidate: [TRPCQueryKey];
}

export const ee = new EventEmitter<IEventEmitter>();

type TRPCQueryKey = ReturnType<typeof getQueryKey>;

/**
 * The main router for the backend, contains all other routers
 */
const appRouter = t.router({
  test: publicProcedure.input(z.void()).query(() => {
    return "Hello world!";
  }),
  bot: botRouter,
  auth: authRouter,
  events: eventsRouter,
  outreach: outreachRouter,
  users: usersRouter,
  invalidator: publicProcedure.subscription(() => {
    return observable<TRPCQueryKey>((emit) => {
      ee.on("invalidate", (key) => {
        emit.next(key);
      });

      return () => {
        ee.off("invalidate");
      };
    });
  }),
});

export type AppRouter = typeof appRouter;

export const rtrpc = createTRPCReact<AppRouter>();

export default appRouter;
