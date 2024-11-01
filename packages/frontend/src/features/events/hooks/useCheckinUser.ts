import { eventQueryKeys } from "@/queries/events.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCheckinUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpcClient.events.userCheckin.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
