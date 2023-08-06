import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";
import { userKeys } from "../../../api/query/user.api";

export default function useScanin() {
  const queryClient = useQueryClient();
  return useMutation({
    ...eventApi.scanInEvent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvp(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.pendingRsvps(),
      });
    },
  });
}
