import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proxyClient.events.editUserAttendance.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
