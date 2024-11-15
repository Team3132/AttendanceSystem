import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys, usersQueryKeys } from "@/api/queryKeys";

export default function useSelfCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trpcClient.events.selfCheckout.mutate,
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
