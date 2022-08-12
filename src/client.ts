import { ApiClient } from "./generated";

export const api = new ApiClient({
  BASE: "https://api.team3132.com",
  WITH_CREDENTIALS: true,
});
