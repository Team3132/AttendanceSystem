import z from "zod";
import { t } from "../trpc";
import { botRouter } from "./bot.router";
import { authRouter } from "./auth.router";
import { publicProcedure } from "../trpc/utils";
import { eventRouter } from "./event.router";
import { outreachRouter } from "./outreach.router";
import { userRouter } from "./user.router";

const appRouter = t.router({
  test: publicProcedure.input(z.void()).query(() => {
    return "Hello world!";
  }),
  bot: botRouter,
  auth: authRouter,
  events: eventRouter,
  outreach: outreachRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
