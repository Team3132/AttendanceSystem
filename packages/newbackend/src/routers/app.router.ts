import z from "zod";
import { t } from "../trpc";

const appRouter = t.router({
    test: t.procedure.input(z.void()).query(() => {
        return "Hello world!";
    })
})

export type AppRouter = typeof appRouter;

export default appRouter;