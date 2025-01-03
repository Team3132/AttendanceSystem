import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { sessionMiddleware } from "@/middleware/authMiddleware";
import { EditRSVPSelfSchema } from "@/api/schema/EditRSVPSelfSchema";
import { editUserRsvpStatus } from "@/api/services/events.service";

const editSelfRsvpFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .validator(EditRSVPSelfSchema)
  .handler(async ({ data, context }) =>
    editUserRsvpStatus(context.user.id, data),
  );

export default function useUpdateRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editSelfRsvpFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvp(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
