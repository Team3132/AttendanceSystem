import { useAuthStatus } from "@/features/auth";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { eventKeys } from "./keys";

export default function useEvents(
  take?: number,
  from?: DateTime,
  to?: DateTime
) {
  return useQuery({
    queryFn: () => api.event.getEvents(from?.toISO(), to?.toISO(), take),
    queryKey: eventKeys.range(take, from, to),
  });
}
