import { ApiClient } from "./generated";

export const api = new ApiClient({
  BASE: import.meta.env.VITE_BACKEND_URL,
  WITH_CREDENTIALS: true,
});
