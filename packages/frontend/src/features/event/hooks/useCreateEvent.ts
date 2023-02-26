import { EventResponseType, ApiError, CreateEventDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { eventKeys } from "./keys";

export default function useCreateEvent() {
  return useMutation<EventResponseType, ApiError, CreateEventDto>({
    mutationFn: (data) => api.event.createEvent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(eventKeys.all);
    },
  });
}
