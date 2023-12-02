import { initTRPC } from "@trpc/server";
import { createContext } from "./context";
import superjson from 'superjson';

export const t = initTRPC.context<typeof createContext>().create({
    transformer: superjson
});