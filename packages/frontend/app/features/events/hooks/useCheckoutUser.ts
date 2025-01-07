import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/server/queryKeys";
import { createServerFn } from "@tanstack/start";
import { UserCheckoutSchema } from "@/server/schema/UserCheckoutSchema";
import { userCheckout } from "@/server/services/events.service";

const userCheckoutFn = createServerFn({
  method: "POST",
})
  .validator(UserCheckoutSchema)
  .handler(async ({ data }) => userCheckout(data.userId, data.eventId));

export default function useCheckoutUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userCheckoutFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
