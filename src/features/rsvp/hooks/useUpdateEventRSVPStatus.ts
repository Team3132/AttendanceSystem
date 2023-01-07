import { Rsvp, ApiError, UpdateOrCreateRSVP } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { rsvpKeys } from "./keys";

export default function useUpdateEventRSVPStatus() {
  return useMutation<
    Rsvp,
    ApiError,
    { eventId: string; rsvp: UpdateOrCreateRSVP }
  >({
    mutationFn: ({ eventId, rsvp }) => api.event.setEventRsvp(eventId, rsvp),
    onSuccess: (data, { eventId }) => {
      queryClient.setQueryData(rsvpKeys.one(eventId), data);
      queryClient.invalidateQueries(rsvpKeys.event(eventId));
      // queryClient.invalidateQueries(["EventRSVP", eventId]);
    },
  });
}
