import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";

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
