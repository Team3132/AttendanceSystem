import { z } from "zod";
import { t } from "../trpc";
import { sessionProcedure } from "../trpc/utils";
import { getOutreachTime } from "../services/outreach.service";
import {LeaderBoardSchema} from "../schema/LeaderboardSchema";

export const outreachRouter = t.router({
  leaderboard: sessionProcedure
    .input(z.void())
    .output(LeaderBoardSchema)
    .query(() => getOutreachTime()),
});
