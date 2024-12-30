import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { editUserAttendance } from "@/api/services/events.service";
import { EditUserAttendanceSchema } from "@/api/schema/EditUserAttendanceSchema";

const editUserAttendanceFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(EditUserAttendanceSchema)
  .handler(async ({ data }) => editUserAttendance(data));

export default function useUpdateUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUserAttendanceFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
    },
  });
}
