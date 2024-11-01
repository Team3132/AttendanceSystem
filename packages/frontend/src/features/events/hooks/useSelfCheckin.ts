import { eventQueryKeys } from "@/queries/events.queries";
import { usersQueryKeys } from "@/queries/users.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useSelfCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trpcClient.events.selfCheckin.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfPendingRsvps(),
      });
    },
  });
}
