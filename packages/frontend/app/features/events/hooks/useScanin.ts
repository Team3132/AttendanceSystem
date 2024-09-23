import { trpc } from "@/trpcClient";

export default function useScanin() {
  const utils = trpc.useUtils();
  return trpc.events.scanin.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
      utils.events.getSelfEventRsvp.invalidate(data.eventId);
      utils.users.getUserPendingRsvps.invalidate();
    },
  });
}
