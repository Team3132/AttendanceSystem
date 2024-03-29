import { trpc } from "@/trpcClient";

export default function useCheckinUser() {
  const utils = trpc.useUtils();

  return trpc.events.userCheckin.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
    },
  });
}
