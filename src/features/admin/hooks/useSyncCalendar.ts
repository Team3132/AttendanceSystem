import { adminMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { syncEvents } from "@/server/services/calalendarSync.service";
import { useMutation } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const syncCalendarFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .handler(() => syncEvents());

export default function useSyncCalendar() {
  const syncCalendar = useServerFn(syncCalendarFn);

  return useMutation({
    mutationFn: () => syncCalendar(),
    meta: {
      invalidates: [eventQueryKeys.events],
    },
  });
}
