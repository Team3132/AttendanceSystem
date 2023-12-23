import { createTRPCQueryUtils } from "@trpc/react-query";
import queryClient from "@/queryClient";
import { trpcClient } from "@/trpcClient";

const queryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient: queryClient,
});

export default queryUtils;
