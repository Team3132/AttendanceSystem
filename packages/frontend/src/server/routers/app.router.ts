import { botRouter } from "./bot.router";

/**
 * The main router for the backend, contains all other routers
 */
const appRouter = botRouter;

export type AppRouter = typeof appRouter;

export default appRouter;
