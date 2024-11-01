import { eventQueryKeys } from "@/queries/events.queries";
import { usersQueryKeys } from "@/queries/users.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
