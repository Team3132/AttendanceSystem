import { queryOptions } from "@tanstack/react-query";
import { cancelableQuery } from "./utils";
import api from "..";

export const outreachKeys = {
  root: ["outreach" as const] as const,
  leaderboard: () => [...outreachKeys.root, "leaderboard"] as const,
};

const outreachApi = {
  getLeaderboard: queryOptions({
    queryKey: outreachKeys.leaderboard(),
    queryFn: ({ signal }) =>
      cancelableQuery(
        api.outreach.outreachControllerGetOutreachLeaderboard(),
        signal,
      ),
  }),
};

export default outreachApi;
