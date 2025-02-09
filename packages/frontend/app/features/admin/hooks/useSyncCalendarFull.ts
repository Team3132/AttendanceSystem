import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { fullSyncEvents } from "@/server/services/calalendarSync.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

const syncCalendarFullFn: () => ReturnType<typeof fullSyncEvents> =
  createServerFn({
    method: "POST",
  })
    .middleware([mentorMiddleware])
    .handler(() => fullSyncEvents());

export default function useSyncCalendarFull() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncCalendarFullFn,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.events,
      });
    },
  });
}
