/// <reference types="vite/client" />

import { ApiError } from "./api/generated";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_BACKEND_URL?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
