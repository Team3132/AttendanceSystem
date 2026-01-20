import { sessionMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys, usersQueryKeys } from "@/server/queryKeys";
import { userCheckout } from "@/server/services/events.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const selfCheckoutFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .inputValidator(z.string())
  .handler(async ({ data, context }) =>
    userCheckout(context, context.user.id, data),
  );

type SelfCheckoutFn = FlattenServerFn<typeof selfCheckoutFn>;

export default function useSelfCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selfCheckoutFn as SelfCheckoutFn,
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
