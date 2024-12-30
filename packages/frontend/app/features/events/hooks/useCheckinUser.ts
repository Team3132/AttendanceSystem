import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";
import { UserCheckinSchema } from "@/api/schema/UserCheckinSchema";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { userCheckin } from "@/api/services/events.service";

const userCheckinFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(UserCheckinSchema)
  .handler(async ({ data }) => userCheckin(data));

export default function useCheckinUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userCheckinFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
