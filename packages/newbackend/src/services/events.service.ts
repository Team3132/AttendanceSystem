import { DateTime } from "luxon";
import db from "../drizzle/db";
import { and, asc, between, eq, gte, lte, or } from "drizzle-orm";
import { event, rsvp } from "../drizzle/schema";
import { z } from "zod";
import { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import EventSchema from "../schema/EventSchema";
import { TRPCError } from "@trpc/server";
import { CreateEventSchema } from "../schema/CreateEventSchema";
import randomStr from "../utils/randomStr";
import { EditEventSchema } from "../schema/EditEventSchema";
import { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import { RSVPSchema } from "../schema/RSVPSchema";
import { CheckinSchema } from "../schema/CheckinSchema";
import { ScaninSchema } from "../schema/ScaninSchema";
import { EditUserAttendanceSchema } from "../schema/EditUserAttendanceSchema";

/**
 * Get upcoming events in the next 24 hours for the daily bot announcement
 */
export async function getNextEvents() {
  const startNextDay = DateTime.now().plus({ day: 1 }).startOf("day");

  const endNextDay = startNextDay.endOf("day");

  const nextEvents = await db.query.event.findMany({
    where: (event) =>
      between(event.startDate, startNextDay.toISO(), endNextDay.toISO()),
    with: {
      rsvps: {
        orderBy: [rsvp.status, rsvp.updatedAt],
        with: {
          user: {
            columns: {
              username: true,
              roles: true,
            },
          },
        },
      },
    },
  });

  return nextEvents;
}

const EventsArraySchema = z.array(EventSchema);

/**
 * Get events
 * @param input Parameters for the query
 * @returns A list of events
 */
export async function getEvents(
  input: z.infer<typeof GetEventParamsSchema>
): Promise<z.infer<typeof EventsArraySchema>> {
  const { from, to, take, type } = input;
  const events = await db.query.event.findMany({
    where: (event) => {
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
          conditions.push(or(lte(event.startDate, to), lte(event.endDate, to)));
        }
      }

      if (type) {
        conditions.push(eq(event.type, type));
      }

      return and(...conditions);
    },
    limit: take,
    orderBy: (event) => [asc(event.startDate)],
  });

  const eventsWithoutSecret = events.map((event) => {
    const { secret, ...rest } = event;
    return rest;
  });

  return eventsWithoutSecret;
}

/**
 * Get an event by id
 * @param id The id of the event
 * @returns The event
 */
export async function getEvent(
  id: string
): Promise<z.infer<typeof EventSchema>> {
  const dbEvent = await db.query.event.findFirst({
    where: (event) => eq(event.id, id),
  });

  if (!dbEvent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  const { secret, ...rest } = dbEvent;

  return rest;
}

/**
 * Get the secret of an event
 * @param id The id of the event
 * @returns The secret of the event
 */
export async function getEventSecret(id: string): Promise<{
  secret: string;
}> {
  const dbEvent = await db.query.event.findFirst({
    where: (event) => eq(event.id, id),
  });

  if (!dbEvent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  const { secret } = dbEvent;

  return { secret };
}

/**
 * Get the RSVP of a user for an event
 * @param eventId The id of the event
 * @param userId The id of the user
 * @returns The RSVP of the user for the event
 */
export async function getEventRsvp(eventId: string, userId: string) {
  const eventRsvp = await db.query.rsvp.findFirst({
    where: (rsvp, { and }) =>
      and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
  });

  return eventRsvp;
}

/**
 * Get the RSVPs of an event with the user's details
 * @param eventId The id of the event
 */
export async function getEventRsvps(eventId: string) {
  const eventRsvps = await db.query.rsvp.findMany({
    where: (rsvp, { and }) => and(eq(rsvp.eventId, eventId)),
    with: {
      user: true,
    },
  });

  return eventRsvps;
}

/**
 * Create an event
 * @param params The parameters for the event
 * @returns The created event
 */
export async function createEvent(params: z.infer<typeof CreateEventSchema>) {
  const [createdEvent] = await db
    .insert(event)
    .values({
      ...params,
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
}

/**
 * Update an event
 * @param params The update parameters
 * @returns The updated event
 */
export async function updateEvent(
  params: z.infer<typeof EditEventSchema>
): Promise<z.infer<typeof EventSchema>> {
  const { id: eventId, ...data } = params;
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
}

/**
 * Delete an event
 * @param id The id of the event
 */
export async function deleteEvent(id: string) {
  const [deletedEvent] = await db
    .delete(event)
    .where(eq(event.id, id))
    .returning();

  if (!deletedEvent) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete event",
    });
  }

  const { secret, ...rest } = deletedEvent;

  return rest;
}

/**
 * Edit user rsvp status
 */
export async function editUserRsvpStatus(
  userId: string,
  params: z.infer<typeof EditRSVPSelfSchema>
) {
  const { eventId, status, delay } = params;
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
}

/**
 * Check in a user
 * @param userId The id of the user to check in
 * @param params The checkin parameters
 * @returns The updated rsvp
 */
export async function userCheckin(
  userId: string,
  params: z.infer<typeof CheckinSchema>
) {
  const { eventId, secret } = params;
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
}

/**
 * Scan in a user using a scancode
 * @param userId The id of the user to check in
 * @param params The scanin parameters (code)
 * @returns The updated rsvp
 */
export async function userScanin(
  userId: string,
  params: z.infer<typeof ScaninSchema>
) {
  const { eventId, scancode: code } = params;

  // find scancode
  const dbScancode = await db.query.scancode.findFirst({
    where: (scancode) => eq(scancode.code, code),
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
}

/**
 * Check out a user
 * @param userId The userId to check out of an event
 * @param eventId The eventId to check out of
 * @returns The updated rsvp
 */
export async function userCheckout(userId: string, eventId: string) {
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
}

/**
 * Edit a user's event attendance
 */
export async function editUserAttendance(
  params: z.infer<typeof EditUserAttendanceSchema>
) {
  const { userId, eventId, checkinTime, checkoutTime } = params;

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
}
