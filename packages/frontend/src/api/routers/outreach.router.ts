import { OutreachTimeSchema } from "../schema/OutreachTimeSchema";
import { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";
import { getOutreachTime } from "../services/outreach.service";
import { t } from "../trpc";
import { sessionProcedure } from "../trpc/utils";

export const outreachRouter = t.router({
  outreachLeaderboard: sessionProcedure
    .input(OutreachTimeSchema)
    .output(PagedLeaderboardSchema)
    .query(({ input }) => getOutreachTime(input)),
});
