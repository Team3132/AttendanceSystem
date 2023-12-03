import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "newbackend";
export const trpc = createTRPCReact<AppRouter>();
