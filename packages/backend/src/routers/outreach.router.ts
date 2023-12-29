import { t } from "../trpc";
import { sessionProcedure } from "../trpc/utils";
import { getOutreachTime } from "../services/outreach.service";
import { OutreachTimeSchema } from "../schema/OutreachTimeSchema";
import { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";

export const outreachRouter = t.router({
  leaderboard: sessionProcedure
    .input(OutreachTimeSchema)
    .output(PagedLeaderboardSchema)
    .query(({ input }) => getOutreachTime(input)),
});
