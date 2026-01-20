import { toaster } from "@/components/Toaster";
import { adminMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { syncEvents } from "@/server/services/calalendarSync.service";
import { useMutation } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const syncCalendarFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .handler(({ context }) => syncEvents(context));

export default function useSyncCalendar() {
  const syncCalendar = useServerFn(syncCalendarFn);

  return useMutation({
    mutationFn: () => syncCalendar(),
    meta: {
      invalidates: [eventQueryKeys.events],
    },
    onSuccess: (data) => {
      toaster.success({
        title: "Synced Calendar!",
        description: `Updated ${data.updatedEvents} events and deleted ${data.deletedEventCount}.`,
      });
    },
  });
}
