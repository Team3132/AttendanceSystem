import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proxyClient.events.createEvent.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventsList,
      });
    },
  });
}
