import { sessionMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys, usersQueryKeys } from "@/server/queryKeys";
import { SelfCheckinSchema } from "@/server/schema/SelfCheckinSchema";
import { selfCheckin } from "@/server/services/events.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const selfCheckinFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .inputValidator(SelfCheckinSchema)
  .handler(async ({ data, context }) =>
    selfCheckin(context, context.user.id, data),
  );

type SelfCheckinFn = FlattenServerFn<typeof selfCheckinFn>;

export default function useSelfCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selfCheckinFn as SelfCheckinFn,
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
