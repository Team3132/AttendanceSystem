import { trpc } from "../../../utils/trpc";

export default function useUpdateRsvp() {
  const utils = trpc.useUtils();

  return trpc.events.editSelfRsvp.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
      utils.events.getSelfEventRsvp.invalidate(data.eventId);
    },
  });
}
