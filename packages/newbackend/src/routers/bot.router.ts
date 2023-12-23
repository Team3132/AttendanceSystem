import { z } from "zod";
import { t } from "../trpc";
import { tokenProcedure } from "../trpc/utils";
import { getOutreachTime } from "../services/outreach.service";
import { LeaderBoardSchema } from "../schema/LeaderboardSchema";
import { getNextEvents, userCheckout } from "../services/events.service";
import { EventsArraySchema } from "../schema/EventsArraySchema";
import { UserCheckoutSchema } from "../schema";

/**
 * A router than the bot uses to communicate with the backend
 */
export const botRouter = t.router({
  online: tokenProcedure
    .input(z.void())
    .output(z.literal("OK"))
    .query(() => "OK"),
  leaderboard: tokenProcedure
    .input(z.void())
    .output(LeaderBoardSchema)
    .query(() => getOutreachTime()),
  getEventsInNextDay: tokenProcedure
    .input(z.void())
    .output(EventsArraySchema)
    .query(() => getNextEvents()),
  checkout: tokenProcedure
    .input(UserCheckoutSchema)
    .mutation(({ input }) => userCheckout(input.userId, input.eventId)),
});
