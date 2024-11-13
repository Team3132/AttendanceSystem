import { appClient, trpcClient } from "@/trpcClient";
import { QueryFunctionContext, queryOptions } from "@tanstack/react-query";
import { authQueryKeys } from "@/api/queryKeys";

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
      queryFn: () => appClient.api.auth.status.$get().then((res) => res.json()),
    }),
};
