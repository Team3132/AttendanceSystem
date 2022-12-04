import { EventResponseType, ApiError } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { eventKeys } from "./keys";

export default function useDeleteEvent() {
  return useMutation<EventResponseType, ApiError, string>({
    mutationFn: (id) => api.event.deleteEvent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries(eventKeys.all);
    },
  });
}
