import { eventQueryKeys } from "@/queries/events.queries";
import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trpcClient.events.createEvent.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventsList,
      });
    },
  });
}
