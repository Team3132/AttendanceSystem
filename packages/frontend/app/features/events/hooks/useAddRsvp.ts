import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { CreateUserRsvpSchema } from "@/server/schema/CreateBlankUserRsvpSchema";
import { createUserRsvp } from "@/server/services/events.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import type {} from "zod";

const createUserRsvpFn: SimpleServerFn<
  typeof CreateUserRsvpSchema,
  typeof createUserRsvp
> = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(CreateUserRsvpSchema)
  .handler(async ({ data }) => createUserRsvp(data));

export default function useAddUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserRsvpFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvps(data.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventRsvp(data.eventId),
      });
    },
  });
}
