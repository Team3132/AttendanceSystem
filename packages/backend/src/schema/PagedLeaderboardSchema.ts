import { LeaderBoardSchema, LeaderBoardUser } from "./LeaderboardSchema";
import { PagedSchema } from "./PagedSchema";

export const PagedLeaderboardSchema = PagedSchema(LeaderBoardUser);
