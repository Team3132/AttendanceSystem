import { eventQueryKeys } from "@/queries/events.queries";
import { proxyClient, trpc } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export default function useDeleteEvent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: proxyClient.events.deleteEvent.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventsList,
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.event(data.id),
      });
      navigate({
        to: "/events",
      });
    },
  });
}
