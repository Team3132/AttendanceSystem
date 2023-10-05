import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api";
import { eventKeys } from "../../../api/query/event.api";
import { useNavigate } from "react-router-dom";

export default function useDeleteEvent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      navigate("/events");
    },
  });
}
