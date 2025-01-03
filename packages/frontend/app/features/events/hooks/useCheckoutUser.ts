import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { UserCheckoutSchema } from "@/api/schema/UserCheckoutSchema";
import { userCheckout } from "@/api/services/events.service";

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
