import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";

export default function useUpdateRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventApi.setEventRsvp,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvp(variables.eventId),
      });
    },
  });
}
