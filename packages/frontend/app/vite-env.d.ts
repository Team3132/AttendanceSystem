/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

import { TRPCClientError } from "@trpc/client";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: TRPCClientError;
  }
}