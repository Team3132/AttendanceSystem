import { trpcClient } from "@/trpcClient";
import { queryOptions } from "@tanstack/react-query";
import { authQueryKeys } from "backend/querykeys";

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
      queryFn: () => trpcClient.auth.status.query(),
    }),
};
