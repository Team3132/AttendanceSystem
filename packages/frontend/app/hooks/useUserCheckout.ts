import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys, usersQueryKeys } from "@/server/queryKeys";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { UserCheckoutSchema } from "@/server/schema/UserCheckoutSchema";
import { createServerFn } from "@tanstack/start";
import { userCheckout } from "@/server/services/events.service";

const userCheckoutFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(UserCheckoutSchema)
  .handler(async ({ data }) => userCheckout(data.userId, data.eventId));

export default function useUserCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userCheckoutFn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(variables.data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userPendingRsvps(variables.data.userId),
      });
    },
  });
}
