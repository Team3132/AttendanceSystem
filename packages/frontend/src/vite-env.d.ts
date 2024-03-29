/// <reference types="vite/client" />

import type { ApiError } from "./api/generated";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_TAURI?: boolean;
  // more env variables...
}

declare module "vite" {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
