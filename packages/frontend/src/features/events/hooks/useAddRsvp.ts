import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api";
import { eventKeys } from "../../../api/query/event.api";

interface AddUserRsvp {
  userId: string;
  eventId: string;
}

export default function useAddUserRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, eventId }: AddUserRsvp) =>
      api.event.addUserRsvp(eventId, { userId }),
    onSuccess: (_result, vars) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventRsvps(vars.eventId),
      });
    },
  });
}
