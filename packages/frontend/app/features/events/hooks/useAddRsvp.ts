import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { CreateBlankUserRsvpSchema } from "@/api/schema/CreateBlankUserRsvpSchema";
import { createBlankUserRsvp } from "@/api/services/events.service";

const createBlankUserRsvpFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(CreateBlankUserRsvpSchema)
  .handler(async ({ data }) => createBlankUserRsvp(data));

export default function useAddUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlankUserRsvpFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
