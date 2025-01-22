import { z } from "zod";
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
import { EventsArraySchema } from "../schema/EventsArraySchema";
import { OutreachTimeSchema } from "../schema/OutreachTimeSchema";
import { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";
import { SelfCheckinWithUserId } from "../schema/SelfCheckinWithUserId";
import {
  editUserRsvpStatus,
  getAutocompleteEvents,
  getEvent,
  getEventRsvps,
  getEventSecret,
  getNextEvents,
  markEventPosted,
  selfCheckin,
  userCheckout,
} from "../services/events.service";
import { getOutreachTime } from "../services/outreach.service";
import { createUser } from "../services/user.service";
import { t } from "../trpc";
import { tokenProcedure } from "../trpc/utils";
import { syncEvents } from "../services/calalendarSync.service";
import { SyncResponseSchema } from "../schema/SyncResponseSchema";
import { generateMessage } from "../services/botService";

/**
 * A router than the bot uses to communicate with the backend
 */
export const botRouter = t.router({
  online: tokenProcedure
    .input(z.void())
    .output(z.literal("OK"))
    .query(() => "OK"),
  outreachLeaderboard: tokenProcedure
    .input(OutreachTimeSchema)
    .output(PagedLeaderboardSchema)
    .query(({ input }) => getOutreachTime(input)),
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
  getEventReminder: tokenProcedure
    .input(z.string())
    .query(({ input }) => generateMessage({ eventId: input })),
  getEventDetails: tokenProcedure
    .input(z.string())
    .output(EventSchema)
    .query(({ input }) => getEvent(input)),
  markEventPosted: tokenProcedure
    .input(z.string())
    .output(EventSchema)
    .mutation(({ input }) => markEventPosted(input)),
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
      editUserRsvpStatus(userId, rest),
    ),
  getAutocompleteEvents: tokenProcedure
    .input(z.string())
    .output(z.array(EventSchema))
    .query(({ input }) => getAutocompleteEvents(input)),
  selfCheckin: tokenProcedure
    .input(SelfCheckinWithUserId)
    .output(RSVPSchema)
    .mutation(({ input: { userId, ...rest } }) => selfCheckin(userId, rest)),
  syncEvents: tokenProcedure
    .input(z.void())
    .output(SyncResponseSchema)
    .mutation(() => syncEvents()),
});
