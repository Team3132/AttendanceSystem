import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { rsvpKeys } from "./keys";

export default function useEventRSVPStatus(eventId: string) {
  return useQuery({
    queryKey: rsvpKeys.event(eventId),
    queryFn: () => api.event.getEventRsvp(eventId),
  });
}
