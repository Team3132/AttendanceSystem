import z from "zod";
import { t } from "../trpc";
import { publicProcedure } from "../trpc/utils";
import { botRouter } from "./bot.router";

/**
 * The main router for the backend, contains all other routers
 */
const appRouter = t.router({
  bot: botRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
