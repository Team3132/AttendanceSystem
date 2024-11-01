import { eventQueryKeys } from "@/queries/events.queries";
import { usersQueryKeys } from "@/queries/users.queries";
import { proxyClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useSelfCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proxyClient.events.selfCheckout.mutate,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(variables),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfPendingRsvps(),
      });
    },
  });
}
