import { proxyClient } from "@/trpcClient";
import { queryOptions } from "@tanstack/react-query";

const queryKeys = {
  leaderboard: ["leaderboard"] as const,
};

export const leaderboardQuery = () =>
  queryOptions({
    queryKey: queryKeys.leaderboard,
    queryFn: async () => {
      proxyClient.outreach.outreachLeaderboard.query();
    },
  });
