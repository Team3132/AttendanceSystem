import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "backend/querykeys";

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
