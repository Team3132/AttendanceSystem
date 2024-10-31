import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient, trpc } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useScanin() {
  const utils = trpc.useUtils();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proxyClient.events.scanin.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvp(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });

      utils.users.getUserPendingRsvps.invalidate();
    },
  });
}
