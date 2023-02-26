import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { rsvpKeys } from "./keys";

export default function useEventRSVPStatuses(eventId?: string) {
  return useQuery({
    queryFn: () => api.event.getEventRsvps(eventId!),
    enabled: !!eventId,
    queryKey: rsvpKeys.event(eventId!),
  });
}
