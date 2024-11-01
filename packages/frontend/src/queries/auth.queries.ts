import { trpcClient } from "@/trpcClient";
import { queryOptions } from "@tanstack/react-query";

export const authQueryKeys = {
  auth: ["auth"] as const,
  status: () => [...authQueryKeys.auth, "status"] as const,
};

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
      queryFn: () => trpcClient.auth.status.query(),
    }),
};
