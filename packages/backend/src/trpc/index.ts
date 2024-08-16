import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { createContext } from "./context";

interface Meta {
  authRequired: boolean;
}

export const t = initTRPC.context<typeof createContext>().meta<Meta>().create({
  transformer: superjson,
});
