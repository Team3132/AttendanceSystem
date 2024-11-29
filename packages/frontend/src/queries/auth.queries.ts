import { appClient, trpcClient } from "@/trpcClient";
import { QueryFunctionContext, queryOptions } from "@tanstack/react-query";
import { authQueryKeys } from "@/api/queryKeys";

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
      queryFn: async () => trpcClient.auth.status.query(),
    }),
};
