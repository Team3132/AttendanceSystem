import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import api from "@/services/api";

export default function usePendingEvents(userId: string = "me") {
  return useQuery({
    queryKey: userKeys.pendingEvents(userId),
    queryFn: () => api.user.getUserPendingRsvPs(userId),
  });
}
