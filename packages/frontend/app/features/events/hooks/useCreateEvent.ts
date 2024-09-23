import { trpc } from "@/trpcClient";

export default function useCreateEvent() {
  const utils = trpc.useUtils();
  return trpc.events.createEvent.useMutation({
    onSuccess: () => {
      utils.events.getEvents.invalidate();
    },
  });
}
