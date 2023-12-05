import { trpc } from "../../../utils/trpc";

export default function useCheckoutUser() {
  const utils = trpc.useUtils();
  return trpc.events.userCheckout.useMutation({
    onSuccess: (data) => {
      utils.events.getEventRsvps.invalidate(data.eventId);
    },
  });
}
