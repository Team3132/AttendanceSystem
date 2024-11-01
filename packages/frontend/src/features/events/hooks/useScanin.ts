import { eventQueryKeys } from "@/queries/events.queries";
import { usersQueryKeys } from "@/queries/users.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useScanin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trpcClient.events.scanin.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvp(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userPendingRsvps(data.userId),
      });
    },
  });
}
