import { queryOptions } from "@tanstack/react-query";
import api from "..";
import { cancelableQuery, mutationOptions } from "./utils";

export const authKeys = {
  root: ["auth" as const] as const,
  status: () => [...authKeys.root, "status"] as const,
};

const authApi = {
  getAuthStatus: queryOptions({
    queryKey: authKeys.status(),
    queryFn: ({ signal }) => cancelableQuery(api.auth.authStatus(), signal),
  }),
  logout: mutationOptions({
    mutationFn: () => api.auth.signout(),
  }),
};

export default authApi;
