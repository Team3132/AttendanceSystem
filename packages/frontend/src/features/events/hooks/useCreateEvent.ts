import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";

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
