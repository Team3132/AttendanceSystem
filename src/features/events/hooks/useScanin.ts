import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys, usersQueryKeys } from "@/server/queryKeys";
import { ScaninSchema } from "@/server/schema/ScaninSchema";
import { userScanin } from "@/server/services/events.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const scaninFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(ScaninSchema)
  .handler(async ({ data }) => userScanin(data));

type ScaninFn = FlattenServerFn<typeof scaninFn>;

export default function useScanin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scaninFn as ScaninFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvp(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userPendingRsvps(data.userId),
      });
    },
  });
}
