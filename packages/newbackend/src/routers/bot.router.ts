import { z } from "zod";
import { t } from "../trpc";
import { tokenProcedure } from "../trpc/utils";
import { getOutreachTime } from "../services/outreach.service";
import { LeaderBoardSchema } from "../schema/LeaderboardSchema";
import {
  editUserRsvpStatus,
  getAutocompleteEvents,
  getEvent,
  getEventRsvps,
  getEventSecret,
  getNextEvents,
  selfCheckin,
  userCheckout,
} from "../services/events.service";
import { EventsArraySchema } from "../schema/EventsArraySchema";
import {
  EditRSVPUserSchema,
  EventSchema,
  RSVPSchema,
  RSVPUserSchema,
  SecretOutputSchema,
  UserCheckoutSchema,
  UserCreateSchema,
  UserSchema,
} from "../schema";
import { createUser } from "../services/user.service";
import { SelfCheckinWithUserId } from "../schema/SelfCheckinWithUserId";

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
  getEventRsvps: tokenProcedure
    .input(z.string())
    .output(z.array(RSVPUserSchema))
    .query(({ input }) => getEventRsvps(input)),
  getEventDetails: tokenProcedure
    .input(z.string())
    .output(EventSchema)
    .query(({ input }) => getEvent(input)),
  getEventSecret: tokenProcedure
    .input(z.string())
    .output(SecretOutputSchema)
    .query(({ input }) => getEventSecret(input)),
  findOrCreateUser: tokenProcedure
    .input(UserCreateSchema)
    .output(UserSchema)
    .mutation(({ input }) => createUser(input)),
  setEventRsvp: tokenProcedure
    .input(EditRSVPUserSchema)
    .output(RSVPSchema)
    .mutation(({ input: { userId, ...rest } }) =>
      editUserRsvpStatus(userId, rest)
    ),
  getAutocompleteEvents: tokenProcedure
    .input(z.string())
    .output(z.array(EventSchema))
    .query(({ input }) => getAutocompleteEvents(input)),
  selfCheckin: tokenProcedure
    .input(SelfCheckinWithUserId)
    .output(RSVPSchema)
    .mutation(({ input: { userId, ...rest } }) => selfCheckin(userId, rest)),
});
