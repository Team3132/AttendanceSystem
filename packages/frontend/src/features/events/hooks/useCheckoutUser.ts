import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../../../api/query/event.api";

export default function useCheckoutUser() {
  const queryClient = useQueryClient();
  return useMutation({
    ...eventApi.checkoutFromEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(data.eventId),
      });
    },
  });
}
