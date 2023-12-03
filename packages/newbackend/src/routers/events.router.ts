import { z } from "zod";
import { t } from "../trpc";
import { mentorSessionProcedure, sessionProcedure } from "../trpc/utils";
import { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import { EventSchema } from "../schema/EventSchema";
import { RSVPSchema } from "../schema/RSVPSchema";
import { RSVPUserSchema } from "../schema/RSVPUserSchema";
import { CreateEventSchema } from "../schema/CreateEventSchema";
import { EditEventSchema } from "../schema/EditEventSchema";
import { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import { EditRSVPUserSchema } from "../schema/EditRSVPUserSchema";
import { CheckinSchema } from "../schema/CheckinSchema";
import { ScaninSchema } from "../schema/ScaninSchema";
import { EditUserAttendanceSchema } from "../schema/EditUserAttendanceSchema";
import {
  createEvent,
  deleteEvent,
  editUserAttendance,
  editUserRsvpStatus,
  getEvent,
  getEventRsvp,
  getEventRsvps,
  getEventSecret,
  getEvents,
  updateEvent,
  userCheckin,
  userCheckout,
  userScanin,
} from "../services/events.service";
import { SecretOutputSchema } from "../schema/SecretOutputSchema";
import { UserCheckinSchema } from "../schema/UserCheckinSchema";
import { UserCheckoutSchema } from "../schema/UserCheckoutSchema";

export const eventRouter = t.router({
  getEvents: sessionProcedure
    .input(GetEventParamsSchema)
    .output(z.array(EventSchema))
    .query(({ input }) => getEvents(input)),
  getEvent: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(EventSchema)
    .query(({ input }) => getEvent(input)),
  getEventSecret: mentorSessionProcedure
    .input(z.string().describe("The event ID"))
    .output(SecretOutputSchema)
    .query(({ input }) => getEventSecret(input)),
  getSelfEventRsvp: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(z.union([RSVPSchema, z.undefined()]))
    .query(({ input, ctx }) => getEventRsvp(input, ctx.user.id)),
  getEventRsvps: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(z.array(RSVPUserSchema))
    .query(({ input }) => getEventRsvps(input)),
  createEvent: mentorSessionProcedure
    .input(CreateEventSchema)
    .output(EventSchema)
    .mutation(({ input }) => createEvent(input)),
  editEvent: mentorSessionProcedure
    .input(EditEventSchema)
    .output(EventSchema)
    .mutation(({ input }) => updateEvent(input)),
  deleteEvent: mentorSessionProcedure
    .input(z.string())
    .output(EventSchema)
    .mutation(({ input }) => deleteEvent(input)),
  editSelfRsvp: sessionProcedure
    .input(EditRSVPSelfSchema)
    .output(RSVPSchema)
    .mutation(({ ctx, input }) => editUserRsvpStatus(ctx.user.id, input)),
  editUserRsvp: mentorSessionProcedure
    .input(EditRSVPUserSchema)
    .output(RSVPSchema)
    .mutation(({ input: { userId, ...data } }) =>
      editUserRsvpStatus(userId, data)
    ),
  selfCheckin: sessionProcedure
    .input(CheckinSchema)
    .output(RSVPSchema)
    .mutation(({ ctx, input }) => userCheckin(ctx.user.id, input)),
  selfScanin: sessionProcedure
    .input(ScaninSchema)
    .output(RSVPSchema)
    .mutation(({ ctx, input }) => userScanin(ctx.user.id, input)),
  selfCheckout: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(RSVPSchema)
    .mutation(({ ctx, input: eventId }) => userCheckout(ctx.user.id, eventId)),
  userCheckin: mentorSessionProcedure
    .input(UserCheckinSchema)
    .output(RSVPSchema)
    .mutation(({ input: { userId, ...input } }) => userCheckin(userId, input)),
  userCheckout: mentorSessionProcedure
    .input(UserCheckoutSchema)
    .output(RSVPSchema)
    .mutation(({ input: { userId, eventId } }) =>
      userCheckout(userId, eventId)
    ),
  editUserAttendance: mentorSessionProcedure
    .input(EditUserAttendanceSchema)
    .output(RSVPSchema)
    .mutation(({ input }) => editUserAttendance(input)),
});
