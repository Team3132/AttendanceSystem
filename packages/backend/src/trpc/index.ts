import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { createContext } from "./context";

export const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});
