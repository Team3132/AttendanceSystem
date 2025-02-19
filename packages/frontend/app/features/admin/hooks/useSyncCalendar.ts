import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { syncEvents } from "@/server/services/calalendarSync.service";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

const syncCalendarFn: () => ReturnType<typeof syncEvents> = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .handler(() => syncEvents());

export default function useSyncCalendar() {
  return useMutation({
    mutationFn: syncCalendarFn,
    meta: {
      invalidates: [eventQueryKeys.events],
    },
  });
}
