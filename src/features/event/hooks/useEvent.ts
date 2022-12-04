import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { eventKeys } from "./keys";

export default function useEvent(eventId?: string) {
  return useQuery({
    queryFn: () => api.event.getEvent(eventId!),
    enabled: !!eventId,
    queryKey: eventKeys.detail(eventId!),
  });
}
