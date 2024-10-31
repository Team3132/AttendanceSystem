import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient, trpc } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useSelfCheckout() {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proxyClient.events.selfCheckout.mutate,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(variables),
      });
      utils.users.getSelfPendingRsvps.invalidate();
    },
  });
}
