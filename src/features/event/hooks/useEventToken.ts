import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { eventKeys } from "./keys";

export default function useEventToken(eventId: string) {
  return useQuery({
    queryFn: () => api.event.getEventSecret(eventId!),
    queryKey: eventKeys.token(eventId!),
  });
}
