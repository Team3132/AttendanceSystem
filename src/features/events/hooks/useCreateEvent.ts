import { adminMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { CreateEventSchema } from "@/server/schema/CreateEventSchema";
import { createEvent } from "@/server/services/events.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const createEventFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(CreateEventSchema)
  .handler(async ({ data }) => createEvent(data));

type CreateEventFn = FlattenServerFn<typeof createEventFn>;

export default function useCreateEvent() {
  return useMutation({
    mutationFn: createEventFn as CreateEventFn,
    meta: {
      invalidates: [eventQueryKeys.events],
    },
  });
}
