import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useUpdateRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proxyClient.events.editSelfRsvp.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvp(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
