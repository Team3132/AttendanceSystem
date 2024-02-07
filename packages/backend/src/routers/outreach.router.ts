import { OutreachTimeSchema } from "../schema/OutreachTimeSchema";
import { PagedBuildPointUsersSchema } from "../schema/PagedBuildPointUsersSchema";
import { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";
import { getBuildPoints, getOutreachTime } from "../services/outreach.service";
import { t } from "../trpc";
import { sessionProcedure } from "../trpc/utils";

export const outreachRouter = t.router({
  outreachLeaderboard: sessionProcedure
    .input(OutreachTimeSchema)
    .output(PagedLeaderboardSchema)
    .query(({ input }) => getOutreachTime(input)),
  buildPointsLeaderboard: sessionProcedure
    .input(OutreachTimeSchema)
    .output(PagedBuildPointUsersSchema)
    .query(({ input }) => getBuildPoints(input)),
});
