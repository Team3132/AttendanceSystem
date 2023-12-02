import z from "zod";
import { t } from "../trpc";
import botRouter from "./bot.router";

const appRouter = t.router({
    test: t.procedure.input(z.void()).query(() => {
        return "Hello world!";
    }),
    bot: botRouter,
})

export type AppRouter = typeof appRouter;

export default appRouter;