import { trpc } from "@/trpcClient";

export default function useUserCheckout() {
  const utils = trpc.useUtils();
  return trpc.events.userCheckout.useMutation({
    onSuccess: (_data, variables) => {
      utils.events.getEventRsvps.invalidate(variables.eventId);
      utils.users.getUserPendingRsvps.invalidate(variables.userId);
    },
  });
}
