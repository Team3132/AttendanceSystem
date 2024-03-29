import { trpc } from "@/trpcClient";

export default function useSelfCheckin() {
  const utils = trpc.useUtils();
  return trpc.events.selfCheckin.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
      utils.users.getSelfPendingRsvps.invalidate();
    },
  });
}
