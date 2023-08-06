import { ApiError, Rsvp } from "@/generated";
import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { rsvpKeys } from "./keys";

export default function useAttend(eventId: string) {
  return useMutation<Rsvp, ApiError, { token: string }>({
    // mutationKey: rsvpKeys.event(eventId),
    mutationFn: ({ token }) =>
      api.event.scanintoEvent(eventId, { code: token }),
    onSuccess: () => {
      queryClient.invalidateQueries(rsvpKeys.event(eventId));
    },
  });
}
