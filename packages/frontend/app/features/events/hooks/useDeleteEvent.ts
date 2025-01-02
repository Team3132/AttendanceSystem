import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { z } from "zod";
import { deleteEvent } from "@/api/services/events.service";

const deleteEventFn = createServerFn({
  method: "POST",
})
  .validator(z.string())
  .middleware([mentorMiddleware])
  .handler(async ({ data }) => deleteEvent(data));

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
