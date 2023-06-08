import { Rsvp, ApiError, UpdateOrCreateRSVP, UpdateRsvpDto } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { rsvpKeys } from "./keys";

export default function useEditUserRSVP() {
  return useMutation<Rsvp, ApiError, { rsvpId: string; rsvp: UpdateRsvpDto }>({
    mutationFn: ({ rsvpId: rsvpId, rsvp }) => api.rsvp.editRsvp(rsvpId, rsvp),
    onSuccess: (data, { rsvpId: eventId }) => {
      queryClient.invalidateQueries(rsvpKeys.event(eventId));
      // queryClient.invalidateQueries(["EventRSVP", eventId]);
    },
  });
}
