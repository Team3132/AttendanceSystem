import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { CreateEventSchema } from "@/api/schema/CreateEventSchema";
import { createEvent } from "@/api/services/events.service";

const createEventFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(CreateEventSchema)
  .handler(async ({ data }) => createEvent(data));

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
