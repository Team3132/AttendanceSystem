import { trpc } from "@/trpcClient";

export default function useAddUserRsvp() {
  const utils = trpc.useUtils();
  return trpc.events.createBlankUserRsvp.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
    },
  });
}
