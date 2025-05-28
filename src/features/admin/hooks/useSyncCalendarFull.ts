import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { fullSyncEvents } from "@/server/services/calalendarSync.service";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const syncCalendarFullFn: () => ReturnType<typeof fullSyncEvents> =
  createServerFn({
    method: "POST",
  })
    .middleware([mentorMiddleware])
    .handler(() => fullSyncEvents());

export default function useSyncCalendarFull() {
  return useMutation({
    mutationFn: syncCalendarFullFn,
    meta: {
      invalidates: [eventQueryKeys.events],
    },
  });
}
