/// <reference types="vite/client" />

import { ApiError } from "./api/generated";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}
