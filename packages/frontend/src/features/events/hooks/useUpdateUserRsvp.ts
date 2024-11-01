import { eventQueryKeys } from "@/queries/events.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpcClient.events.editUserAttendance.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
