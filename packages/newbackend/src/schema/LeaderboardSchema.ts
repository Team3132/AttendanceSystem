import { z } from "zod";

const LeaderBoardUser = z.object({
    username: z.string(),
    userId: z.string(),
    duration: z.string(),
    rank: z.number(),
})

export const LeaderBoardSchema = z.array(LeaderBoardUser);

export default LeaderBoardSchema;