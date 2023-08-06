import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./keys";

export default function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => api.event.checkoutUser(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.pendingEvents("me"),
      });
    },
  });
}
