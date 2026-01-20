import { adminMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { CreateUserRsvpSchema } from "@/server/schema/CreateBlankUserRsvpSchema";
import { createUserRsvp } from "@/server/services/events.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import type {} from "zod";

const createUserRsvpFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateUserRsvpSchema)
  .handler(async ({ data, context }) => createUserRsvp(context, data));

type CreateUserRsvpFn = FlattenServerFn<typeof createUserRsvpFn>;

export default function useAddUserRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserRsvpFn as CreateUserRsvpFn,
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
