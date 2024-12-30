import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys, usersQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { sessionMiddleware } from "@/middleware/authMiddleware";
import { z } from "zod";
import { userCheckout } from "@/api/services/events.service";

const selfCheckoutFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .validator(z.string())
  .handler(async ({ data, context }) => userCheckout(context.user.id, data));

export default function useSelfCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selfCheckoutFn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(variables.data),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfPendingRsvps(),
      });
    },
  });
}
