import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { CreateEventSchema } from "@/server/schema/CreateEventSchema";
import { createEvent } from "@/server/services/events.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

export const createEventFn: SimpleServerFn<
typeof CreateEventSchema,
typeof createEvent
> = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(CreateEventSchema)
  .handler(async ({ data }) => createEvent(data))

export default function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventsList,
      });
    },
  });
}
