import { DateTime } from "luxon";
import db from "../drizzle/db";
import {
  SQL,
  and,
  asc,
  between,
  count,
  eq,
  gte,
  ilike,
  isNull,
  lte,
  or,
} from "drizzle-orm";
import { event, rsvp } from "../drizzle/schema";
import { z } from "zod";
import { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import EventSchema from "../schema/EventSchema";
import { TRPCError } from "@trpc/server";
import { CreateEventSchema } from "../schema/CreateEventSchema";
import randomStr from "../utils/randomStr";
import { EditEventSchema } from "../schema/EditEventSchema";
import { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import { ScaninSchema } from "../schema/ScaninSchema";
import { EditUserAttendanceSchema } from "../schema/EditUserAttendanceSchema";
import { SelfCheckinSchema } from "../schema/SelfCheckinSchema";
import { RSVPUserSchema, UserCheckinSchema } from "../schema";
import { CreateBlankUserRsvpSchema } from "../schema/CreateBlankUserRsvpSchema";
import clampDateTime from "../utils/clampDateTime";
import { ee, rtrpc } from "../routers/app.router";
import { getQueryKey } from "@trpc/react-query";
import { Queue, Worker, Job } from "bullmq";
import env from "../env";
import { PagedEventsSchema } from "../schema/PagedEventsSchema";

interface EventCheckinJobData {
  eventId: string;
  rsvpId: string;
}

const queueName = "event";

export const checkoutQueue = new Queue<EventCheckinJobData>(queueName, {
  connection: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: 2,
  },
});

new Worker(
  queueName,
  async (job: Job<EventCheckinJobData>) => {
    const { eventId, rsvpId } = job.data;

    const currentTime = DateTime.local();

    const fetchedEvent = await db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });

    if (!fetchedEvent) throw new Error("Event not found");

    const eventEndTime = DateTime.fromISO(fetchedEvent.endDate);

    const checkoutTime =
      currentTime > eventEndTime ? eventEndTime : currentTime;

    await db
      .update(rsvp)
      .set({
        checkoutTime: checkoutTime.toISO(),
      })
      .where(and(eq(rsvp.id, rsvpId), isNull(rsvp.checkoutTime)));
  },
  {
    connection: { host: env.REDIS_HOST, port: env.REDIS_PORT, db: 2 },
  }
);

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

  const nextEventsWithoutSecret = nextEvents.map((event) => {
    const { secret, ...rest } = event;
    return rest;
  });

  return nextEventsWithoutSecret;
}

/**
 * Get events
 * @param input Parameters for the query
 * @returns A list of events
 */
export async function getEvents(
  input: z.infer<typeof GetEventParamsSchema>
): Promise<z.infer<typeof PagedEventsSchema>> {
  const { from, to, limit, type, cursor: page } = input;
  const conditions: Array<SQL | undefined> = [];

  if (from && to) {
    conditions.push(
      or(between(event.startDate, from, to), between(event.endDate, from, to))
    );
  } else {
    if (from) {
      conditions.push(or(gte(event.startDate, from), gte(event.endDate, from)));
    }
    if (to) {
      conditions.push(or(lte(event.startDate, to), lte(event.endDate, to)));
    }
  }

  if (type) {
    conditions.push(eq(event.type, type));
  }

  const offset = page * limit;

  const andConditions = and(...conditions);

  const [totalEntry] = await db
    .select({
      total: count(),
    })
    .from(event)
    .where(andConditions);

  if (!totalEntry) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get total events",
    });
  }

  const events = await db.query.event.findMany({
    where: andConditions,
    limit,
    offset,
    orderBy: (event) => [asc(event.startDate)],
  });

  const eventsWithoutSecret = events.map((event) => {
    const { secret, ...rest } = event;
    return rest;
  });

  const { total } = totalEntry;

  /** Undefined if no next page */
  const nextPage = total > offset + limit ? page + 1 : undefined;

  return {
    items: eventsWithoutSecret,
    page,
    total,
    nextPage,
  };
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

  return eventRsvp ?? null;
}

/**
 * Get the RSVPs of an event with the user's details
 * @param eventId The id of the event
 */
export async function getEventRsvps(
  eventId: string
): Promise<Array<z.infer<typeof RSVPUserSchema>>> {
  const eventRsvps = await db.query.rsvp.findMany({
    where: (rsvp, { and }) => and(eq(rsvp.eventId, eventId)),
    orderBy: (rsvp) => [asc(rsvp.updatedAt)],
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

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEvents));

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

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEvent));
  ee.emit("invalidate", getQueryKey(rtrpc.events.getEvents));

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

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEvent));
  ee.emit("invalidate", getQueryKey(rtrpc.events.getEvents));

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
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update RSVP",
    });
  }

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  return updatedRsvp;
}

/**
 * Check in a user, mentor only
 * @param userId The id of the user to check in
 * @param params The checkin parameters
 * @returns The updated rsvp
 */
export async function userCheckin(params: z.infer<typeof UserCheckinSchema>) {
  const { eventId, userId } = params;
  const dbEvent = await db.query.event.findFirst({
    where: eq(event.id, eventId),
  });

  if (!dbEvent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  const eventStartDateTime = DateTime.fromISO(dbEvent.startDate);
  const eventEndDateTime = DateTime.fromISO(dbEvent.endDate);

  const [updatedRsvp] = await db
    .insert(rsvp)
    .values({
      userId,
      eventId,
      checkinTime: clampDateTime(
        DateTime.local(),
        eventStartDateTime,
        eventEndDateTime
      ).toISO(),
      updatedAt: DateTime.local().toISO(),
      createdAt: DateTime.local().toISO(),
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        checkinTime: clampDateTime(
          DateTime.local(),
          eventStartDateTime,
          eventEndDateTime
        ).toISO(),
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvp.eventId, rsvp.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check in",
    });
  }

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  const timeDiff = eventEndDateTime.toMillis() - DateTime.local().toMillis();
  const delay = timeDiff > 0 ? timeDiff : 0;

  await checkoutQueue.add(
    "checkout",
    { eventId, rsvpId: updatedRsvp.id },
    { delay, jobId: updatedRsvp.id }
  );

  return updatedRsvp;
}

/**
 * Scan in a user using a scancode, mentor only
 * @param userId The id of the user to check in
 * @param params The scanin parameters (code)
 * @returns The updated rsvp
 */
export async function userScanin(params: z.infer<typeof ScaninSchema>) {
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

  const { userId } = dbScancode;

  const eventStartDateTime = DateTime.fromISO(dbEvent.startDate);
  const eventEndDateTime = DateTime.fromISO(dbEvent.endDate);

  // find rsvp
  const [updatedRsvp] = await db
    .insert(rsvp)
    .values({
      userId,
      eventId,
      checkinTime: clampDateTime(
        DateTime.local(),
        eventStartDateTime,
        eventEndDateTime
      ).toISO(),
      updatedAt: DateTime.local().toISO(),
      createdAt: DateTime.local().toISO(),
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        checkinTime: clampDateTime(
          DateTime.local(),
          eventStartDateTime,
          eventEndDateTime
        ).toISO(),
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvp.eventId, rsvp.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check in",
    });
  }

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  const timeDiff = eventEndDateTime.toMillis() - DateTime.local().toMillis();
  const delay = timeDiff > 0 ? timeDiff : 0;

  await checkoutQueue.add(
    "checkout",
    { eventId, rsvpId: updatedRsvp.id },
    { delay, jobId: updatedRsvp.id }
  );

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

  const existingEvent = await db.query.event.findFirst({
    where: eq(event.id, eventId),
  });

  if (!existingRsvp) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "RSVP not found, please check in first",
    });
  }

  if (!existingEvent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  if (!existingRsvp.checkinTime) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User is not checked in",
    });
  }

  if (existingRsvp.checkoutTime) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User is already checked out",
    });
  }

  const existingRsvpCheckinTime = DateTime.fromISO(existingRsvp.checkinTime);
  const eventEndDateTime = DateTime.fromISO(existingEvent.endDate);

  const [updatedRsvp] = await db
    .insert(rsvp)
    .values({
      userId,
      eventId,
      checkoutTime: clampDateTime(
        DateTime.local(),
        existingRsvpCheckinTime,
        eventEndDateTime
      ).toISO(),
      createdAt: DateTime.local().toISO(),
      updatedAt: DateTime.local().toISO(),
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        checkoutTime: clampDateTime(
          DateTime.local(),
          existingRsvpCheckinTime,
          eventEndDateTime
        ).toISO(),
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvp.eventId, rsvp.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check out",
    });
  }

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

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
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update RSVP",
    });
  }

  // TODO: Schedule a job to check out the user after the delay

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  return updatedRsvp;
}

export async function selfCheckin(
  userId: string,
  params: z.infer<typeof SelfCheckinSchema>
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

  const currentRSVP = await db.query.rsvp.findFirst({
    where: (rsvp, { and }) =>
      and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
  });

  if (currentRSVP?.checkinTime) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are already checked in",
    });
  }

  const eventStartDateTime = DateTime.fromISO(dbEvent.startDate);
  const eventEndDateTime = DateTime.fromISO(dbEvent.endDate);

  const [updatedRsvp] = await db
    .insert(rsvp)
    .values({
      userId,
      eventId,
      checkinTime: clampDateTime(
        DateTime.local(),
        eventStartDateTime,
        eventEndDateTime
      ).toISO(),
      updatedAt: DateTime.local().toISO(),
      createdAt: DateTime.local().toISO(),
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        checkinTime: clampDateTime(
          DateTime.local(),
          eventStartDateTime,
          eventEndDateTime
        ).toISO(),
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvp.eventId, rsvp.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check in",
    });
  }

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  const timeDiff = eventEndDateTime.toMillis() - DateTime.local().toMillis();
  const delay = timeDiff > 0 ? timeDiff : 0;

  await checkoutQueue.add(
    "checkout",
    { eventId, rsvpId: updatedRsvp.id },
    { delay, jobId: updatedRsvp.id }
  );

  return updatedRsvp;
}

export async function createBlankUserRsvp(
  params: z.infer<typeof CreateBlankUserRsvpSchema>
) {
  const { userId, eventId } = params;
  const [createdRsvp] = await db
    .insert(rsvp)
    .values({
      userId,
      eventId,
      createdAt: DateTime.local().toISO(),
      updatedAt: DateTime.local().toISO(),
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvp.eventId, rsvp.userId],
    })
    .returning();

  if (!createdRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create RSVP",
    });
  }

  ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  return createdRsvp;
}

export async function getAutocompleteEvents(like?: string) {
  const events = await db.query.event.findMany({
    where: (event) => {
      const conditions: Array<SQL<unknown>> = [
        gte(event.endDate, DateTime.local().toISO()),
      ];

      if (like) {
        const condition = or(
          ilike(event.title, `%${like}%`),
          ilike(event.id, `%${like}%`)
        );

        if (condition) {
          conditions.push(condition);
        }
      }

      return and(...conditions);
    },
    orderBy: (event) => [asc(event.startDate)],
    limit: 10,
  });

  return events;
}
