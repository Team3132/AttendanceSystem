import { ApiClient } from "./generated";

export const api = new ApiClient({
  BASE: "https://localhost:3443",
  WITH_CREDENTIALS: true,
});
