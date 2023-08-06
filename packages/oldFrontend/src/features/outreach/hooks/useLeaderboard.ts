import { useQuery } from "@tanstack/react-query";
import { outreachKeys } from "./keys";
import api from "@/services/api";

export default function useLeaderboard() {
  return useQuery({
    queryKey: outreachKeys.leaderboard,
    queryFn: () => api.outreach.outreachControllerGetOutreachLeaderboard(),
  });
}
