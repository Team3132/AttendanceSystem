import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";

export default function useCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    ...eventApi.scanInToEvent,
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
