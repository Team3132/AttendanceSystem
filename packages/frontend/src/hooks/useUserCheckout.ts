import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys, usersQueryKeys } from "@/api/queryKeys";

export default function useUserCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trpcClient.events.userCheckout.mutate,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userPendingRsvps(variables.userId),
      });
    },
  });
}
