<<<<<<< HEAD
import { trpcClient } from "@/trpcClient";
=======
import { proxyClient } from "@/trpcClient";
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
import { queryOptions } from "@tanstack/react-query";

export const authQueryKeys = {
  auth: ["auth"] as const,
  status: () => [...authQueryKeys.auth, "status"] as const,
};

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
<<<<<<< HEAD
      queryFn: () => trpcClient.auth.status.query(),
=======
      queryFn: () => proxyClient.auth.status.query(),
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
    }),
};
