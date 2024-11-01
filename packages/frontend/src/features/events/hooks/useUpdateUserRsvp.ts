import { eventQueryKeys } from "@/queries/events.queries";
<<<<<<< HEAD
import { trpcClient } from "@/trpcClient";
=======
import { proxyClient } from "@/trpcClient";
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
<<<<<<< HEAD
    mutationFn: trpcClient.events.editUserAttendance.mutate,
=======
    mutationFn: proxyClient.events.editUserAttendance.mutate,
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
