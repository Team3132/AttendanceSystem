import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient, trpc } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useUserCheckout() {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proxyClient.events.userCheckout.mutate,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(variables.eventId),
      });
      utils.users.getUserPendingRsvps.invalidate(variables.userId);
    },
  });
}
