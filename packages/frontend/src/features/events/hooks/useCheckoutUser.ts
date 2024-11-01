import { eventQueryKeys } from "@/queries/events.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function useCheckoutUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trpcClient.events.userCheckout.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
