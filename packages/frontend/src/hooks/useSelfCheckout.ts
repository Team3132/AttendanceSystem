import { trpc } from "@/trpcClient";

export default function useSelfCheckout() {
  const utils = trpc.useUtils();
  return trpc.events.selfCheckout.useMutation({
    onSuccess: (_data, variables) => {
      utils.events.getEventRsvps.invalidate(variables);
      utils.users.getSelfPendingRsvps.invalidate();
    },
  });
}
