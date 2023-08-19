import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";

export default function useCheckinUser() {
  const queryClient = useQueryClient();
  return useMutation({
    ...eventApi.checkinUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(data.eventId),
      });
    },
  });
}
