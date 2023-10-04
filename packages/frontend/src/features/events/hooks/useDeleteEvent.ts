import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api";
import { eventKeys } from "../../../api/query/event.api";

export default function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      api.event.deleteEvent(eventId);
    },
    onSuccess: (_data, eventId) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.events(),
      });
      queryClient.removeQueries({
        queryKey: eventKeys.event(eventId),
      });
    },
  });
}
