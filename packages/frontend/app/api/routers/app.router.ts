import z from "zod";
import { t } from "../trpc";
import { publicProcedure } from "../trpc/utils";
import { authRouter } from "./auth.router";
import { botRouter } from "./bot.router";
import { eventRouter as eventsRouter } from "./events.router";
import { outreachRouter } from "./outreach.router";
import { userRouter as usersRouter } from "./users.router";

/**
 * The main router for the backend, contains all other routers
 */
const appRouter = t.router({
  bot: botRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
