import { eventQueryKeys } from "@/queries/events.queries";
<<<<<<< HEAD
import { trpcClient } from "@/trpcClient";
=======
import { proxyClient } from "@/trpcClient";
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
<<<<<<< HEAD
    mutationFn: trpcClient.events.createEvent.mutate,
=======
    mutationFn: proxyClient.events.createEvent.mutate,
>>>>>>> 5fa3d80667af05e512045626e9733865eeaf59b8
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventsList,
      });
    },
  });
}
