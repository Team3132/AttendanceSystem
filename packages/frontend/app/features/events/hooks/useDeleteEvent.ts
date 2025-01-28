import { mentorMiddleware } from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import { deleteEvent } from "@/server/services/events.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z, type ZodString } from "zod";

const deleteEventFn = createServerFn({
  method: "POST",
})
  .validator(z.string())
  .middleware([mentorMiddleware])
  .handler(async ({ data }) => deleteEvent(data)) as SimpleServerFn<
  typeof ZodString,
  typeof deleteEvent
>;

export default function useDeleteEvent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteEventFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.eventsList,
      });
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.event(data.id),
      });
      navigate({
        to: "/events",
        search: {},
      });
    },
  });
}
