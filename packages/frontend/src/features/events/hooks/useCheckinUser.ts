import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCheckinUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proxyClient.events.userCheckin.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
