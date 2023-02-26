import { EventResponseType, ApiError, UpdateEventDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { eventKeys } from "./keys";

export default function useUpdateEvent() {
  return useMutation<
    EventResponseType,
    ApiError,
    { id: string; data: UpdateEventDto }
  >({
    mutationFn: ({ id, data }) => api.event.updateEvent(id, data),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(eventKeys.detail(id), data);
    },
  });
}
