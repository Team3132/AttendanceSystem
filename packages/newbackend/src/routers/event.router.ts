import { z } from "zod";
import { t } from "../trpc";
import { mentorSessionProcedure, sessionProcedure } from "../trpc/utils";
import { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import { and, asc, between, eq, gte, lte, or } from "drizzle-orm";
import db from "../drizzle/db";
import { event, rsvp, scancode } from "../drizzle/schema";
import { EventSchema } from "../schema/EventSchema";
import { TRPCError } from "@trpc/server";
import { RSVPSchema } from "../schema/RSVPSchema";
import { RSVPUserSchema } from "../schema/RSVPUserSchema";
import { CreateEventSchema } from "../schema/CreateEventSchema";
import randomStr from "../utils/randomStr";
import { EditEventSchema } from "../schema/EditEventSchema";
import { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import { EditRSVPUserSchema } from "../schema/EditRSVPUserSchema";
import { CheckinSchema } from "../schema/CheckinSchema";
import { ScaninSchema } from "../schema/ScaninSchema";
import { EditUserAttendanceSchema } from "../schema/EditUserAttendanceSchema";
import { DateTime } from "luxon";

export const eventRouter = t.router({
  getEvents: sessionProcedure
    .input(GetEventParamsSchema)
    .output(z.array(EventSchema))
    .query(async ({ ctx, input }) => {
      const { from, to, take, type } = input;
      const events = await db.query.event.findMany({
        where: () => {
          const conditions = [];
          if (from && to) {
            conditions.push(
              or(
                between(event.startDate, from, to),
                between(event.endDate, from, to)
              )
            );
          } else {
            if (from) {
              conditions.push(
                or(gte(event.startDate, from), gte(event.endDate, from))
              );
            }
            if (to) {
              conditions.push(
                or(lte(event.startDate, to), lte(event.endDate, to))
              );
            }
          }

          if (type) {
            conditions.push(eq(event.type, type));
          }

          return and(...conditions);
        },
        limit: take,
        orderBy: [asc(event.startDate)],
      });

      const eventsWithoutSecret = events.map((event) => {
        const { secret, ...rest } = event;
        return rest;
      });

      return eventsWithoutSecret;
    }),
  getEvent: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(EventSchema)
    .query(async ({ input }) => {
      const dbEvent = await db.query.event.findFirst({
        where: eq(event.id, input),
      });

      if (!dbEvent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const { secret, ...rest } = dbEvent;

      return rest;
    }),
  getEventSecret: mentorSessionProcedure
    .input(z.string().describe("The event ID"))
    .output(
      z.object({
        secret: z.string(),
      })
    )
    .query(async ({ input }) => {
      const dbEvent = await db.query.event.findFirst({
        where: eq(event.id, input),
      });

      if (!dbEvent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const { secret } = dbEvent;

      return { secret };
    }),
  getSelfEventRsvp: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(z.union([RSVPSchema, z.undefined()]))
    .query(async ({ input, ctx }) => {
      const eventRsvp = await db.query.rsvp.findFirst({
        where: (rsvp, { and }) =>
          and(eq(rsvp.eventId, input), eq(rsvp.userId, ctx.user.id)),
      });

      return eventRsvp;
    }),
  getEventRsvps: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(z.array(RSVPUserSchema))
    .query(async ({ input, ctx }) => {
      const eventRsvps = await db.query.rsvp.findMany({
        where: (rsvp, { and }) => and(eq(rsvp.eventId, input)),
        with: {
          user: true,
        },
      });

      return eventRsvps;
    }),

  createEvent: mentorSessionProcedure
    .input(CreateEventSchema)
    .output(EventSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdEvent] = await db
        .insert(event)
        .values({
          ...input,
          secret: randomStr(8),
        })
        .returning();

      if (!createdEvent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create event",
        });
      }

      const { secret, ...data } = createdEvent;

      return data;
    }),
  editEvent: mentorSessionProcedure
    .input(EditEventSchema)
    .output(EventSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: eventId, ...data } = input;
      const [updatedEvent] = await db
        .update(event)
        .set(data)
        .where(eq(event.id, eventId))
        .returning();

      if (!updatedEvent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update event",
        });
      }

      const { secret, ...rest } = updatedEvent;

      return rest;
    }),
  deleteEvent: mentorSessionProcedure
    .input(z.string())
    .output(EventSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedEvent] = await db
        .delete(event)
        .where(eq(event.id, input))
        .returning();

      if (!deletedEvent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete event",
        });
      }

      const { secret, ...rest } = deletedEvent;

      return rest;
    }),
  editSelfRsvp: sessionProcedure
    .input(EditRSVPSelfSchema)
    .output(RSVPSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { eventId, status, delay } = input;
      const [updatedRsvp] = await db
        .insert(rsvp)
        .values({
          userId,
          eventId,
          status,
          delay,
        })
        .onConflictDoUpdate({
          set: {
            userId,
            eventId,
            status,
            delay,
          },
          target: [rsvp.eventId, rsvp.userId],
        });

      if (!updatedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update RSVP",
        });
      }

      return updatedRsvp;
    }),
  editUserRsvp: mentorSessionProcedure
    .input(EditRSVPUserSchema)
    .output(RSVPSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, eventId, status, delay } = input;
      const [updatedRsvp] = await db
        .insert(rsvp)
        .values({
          userId,
          eventId,
          status,
          delay,
        })
        .onConflictDoUpdate({
          set: {
            userId,
            eventId,
            status,
            delay,
          },
          target: [rsvp.eventId, rsvp.userId],
        });

      if (!updatedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update RSVP",
        });
      }

      return updatedRsvp;
    }),
  /**
   * Check in to the event using the event secret
   */
  selfCheckin: sessionProcedure
    .input(CheckinSchema)
    .output(RSVPSchema)
    .mutation(async ({ ctx, input }) => {
      const { eventId, secret } = input;
      const dbEvent = await db.query.event.findFirst({
        where: eq(event.id, eventId),
      });

      if (!dbEvent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      if (dbEvent.secret !== secret) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid secret",
        });
      }

      const [updatedRsvp] = await db
        .insert(rsvp)
        .values({
          userId: ctx.user.id,
          eventId,
          checkinTime: DateTime.local().toISO(),
          updatedAt: DateTime.local().toISO(),
          createdAt: DateTime.local().toISO(),
        })
        .onConflictDoUpdate({
          set: {
            userId: ctx.user.id,
            eventId,
            checkinTime: DateTime.local().toISO(),
            updatedAt: DateTime.local().toISO(),
          },
          target: [rsvp.eventId, rsvp.userId],
        });

      if (!updatedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check in",
        });
      }

      // TODO: Schedule a job to check out the user after the delay

      return updatedRsvp;
    }),
  /**
   * Scan in to the event using the event secret
   */
  selfScanin: sessionProcedure
    .input(ScaninSchema)
    .output(RSVPSchema)
    .mutation(async ({ ctx, input }) => {
      const { eventId, scancode: code } = input;
      const { id: userId } = ctx.user;

      // find scancode
      const dbScancode = await db.query.scancode.findFirst({
        where: eq(scancode.code, code),
      });

      if (!dbScancode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scancode not found",
        });
      }

      // find event
      const dbEvent = await db.query.event.findFirst({
        where: eq(event.id, eventId),
      });

      if (!dbEvent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // find rsvp
      const [updatedRsvp] = await db
        .insert(rsvp)
        .values({
          userId,
          eventId,
          checkinTime: DateTime.local().toISO(),
          updatedAt: DateTime.local().toISO(),
          createdAt: DateTime.local().toISO(),
        })
        .onConflictDoUpdate({
          set: {
            userId,
            eventId,
            checkinTime: DateTime.local().toISO(),
            updatedAt: DateTime.local().toISO(),
          },
          target: [rsvp.eventId, rsvp.userId],
        });

      if (!updatedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check in",
        });
      }

      // TODO: Schedule a job to check out the user after the delay

      return updatedRsvp;
    }),
  /**
   * Check out of the event, if the user is checked in
   */
  selfCheckout: sessionProcedure
    .input(z.string().describe("The event ID"))
    .output(RSVPSchema)
    .mutation(async ({ ctx, input: eventId }) => {
      const { id: userId } = ctx.user;

      const existingRsvp = await db.query.rsvp.findFirst({
        where: (rsvp, { and }) =>
          and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
      });

      if (!existingRsvp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "RSVP not found",
        });
      }

      if (!existingRsvp.checkinTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not checked in",
        });
      }

      const [updatedRsvp] = await db
        .insert(rsvp)
        .values({
          userId,
          eventId,
          checkoutTime: DateTime.local().toISO(),
          createdAt: DateTime.local().toISO(),
          updatedAt: DateTime.local().toISO(),
        })
        .onConflictDoUpdate({
          set: {
            userId,
            eventId,
            checkoutTime: DateTime.local().toISO(),
            updatedAt: DateTime.local().toISO(),
          },
          target: [rsvp.eventId, rsvp.userId],
        });

      if (!updatedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check out",
        });
      }

      return updatedRsvp;
    }),
  /**
   * Edit a user's event attendance
   */
  editUserAttendance: mentorSessionProcedure
    .input(EditUserAttendanceSchema)
    .output(RSVPSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, eventId, checkinTime, checkoutTime } = input;

      if (checkoutTime && !checkinTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot check out without checking in",
        });
      }

      const [updatedRsvp] = await db
        .insert(rsvp)
        .values({
          userId,
          eventId,
          checkinTime,
          checkoutTime,
          createdAt: DateTime.local().toISO(),
          updatedAt: DateTime.local().toISO(),
        })
        .onConflictDoUpdate({
          set: {
            userId,
            eventId,
            checkinTime,
            checkoutTime,
            updatedAt: DateTime.local().toISO(),
          },
          target: [rsvp.eventId, rsvp.userId],
        });

      if (!updatedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update RSVP",
        });
      }

      // TODO: Schedule a job to check out the user after the delay

      return updatedRsvp;
    }),
});
