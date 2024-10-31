import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient, trpc } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useSelfCheckin() {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proxyClient.events.selfCheckin.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
      utils.users.getSelfPendingRsvps.invalidate();
    },
  });
}
