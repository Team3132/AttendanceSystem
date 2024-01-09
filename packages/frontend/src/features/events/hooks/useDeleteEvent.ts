import { trpc } from "@/trpcClient";
import { useNavigate } from "@tanstack/react-router";

export default function useDeleteEvent() {
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  return trpc.events.deleteEvent.useMutation({
    onSuccess: (data) => {
      utils.events.getEvents.invalidate();
      utils.events.getEvent.invalidate(data.id);
      navigate({
        to: "/events/",
      });
    },
  });
}
