import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys, usersQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { sessionMiddleware } from "@/middleware/authMiddleware";
import { SelfCheckinSchema } from "@/api/schema/SelfCheckinSchema";
import { selfCheckin } from "@/api/services/events.service";

const selfCheckinFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .validator(SelfCheckinSchema)
  .handler(async ({ data, context }) => selfCheckin(context.user.id, data));

export default function useSelfCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selfCheckinFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfPendingRsvps(),
      });
    },
  });
}