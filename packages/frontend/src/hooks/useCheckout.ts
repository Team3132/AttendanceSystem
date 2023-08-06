import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventApi, { eventKeys } from "../api/query/event.api";
import { userKeys } from "../api/query/user.api";

export default function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    ...eventApi.checkoutFromEvent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(variables),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.pendingRsvps(),
      });
    },
  });
}
