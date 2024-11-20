import { appClient, trpcClient } from "@/trpcClient";
import { QueryFunctionContext, queryOptions } from "@tanstack/react-query";
import { authQueryKeys } from "@/api/queryKeys";

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
      queryFn: async () => {
        const response = await appClient.api.auth.status.$get();
        if (response.ok) {
          return response.json();
        }

        throw response;
      },
    }),
};
