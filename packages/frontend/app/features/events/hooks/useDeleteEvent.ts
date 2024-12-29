import { trpcClient } from "@/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { eventQueryKeys } from "@/api/queryKeys";

export default function useDeleteEvent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: trpcClient.events.deleteEvent.mutate,
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
