"use server";

import { getQueryKey } from "@trpc/react-query";
import { TRPCError } from "@trpc/server";
import { type Job, Queue, Worker } from "bullmq";
import {
  type SQL,
  and,
  asc,
  between,
  count,
  eq,
  gte,
  ilike,
  isNull,
  lte,
  not,
  or,
} from "drizzle-orm";
import { DateTime } from "luxon";
import type { z } from "zod";
import db from "../drizzle/db";
import { eventTable, rsvpTable } from "../drizzle/schema";
import env from "../env";
import { ee } from "../routers/app.router";
import type { RSVPUserSchema, UserCheckinSchema } from "../schema";
import type { CreateBlankUserRsvpSchema } from "../schema/CreateBlankUserRsvpSchema";
import type { CreateEventSchema } from "../schema/CreateEventSchema";
import type { EditEventSchema } from "../schema/EditEventSchema";
import type { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import type { EditUserAttendanceSchema } from "../schema/EditUserAttendanceSchema";
import type EventSchema from "../schema/EventSchema";
import type { EventWithSecretArraySchema } from "../schema/EventWithSecretArraySchema";
import type { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import type { PagedEventsSchema } from "../schema/PagedEventsSchema";
import type { ScaninSchema } from "../schema/ScaninSchema";
import type { SelfCheckinSchema } from "../schema/SelfCheckinSchema";
import clampDateTime from "../utils/clampDateTime";
import randomStr from "../utils/randomStr";

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

export const registerWorker = () => {
  new Worker(
    queueName,
    async (job: Job<EventCheckinJobData>) => {
      const { eventId, rsvpId } = job.data;

      const currentTime = DateTime.local();

      const fetchedEvent = await db.query.eventTable.findFirst({
        where: (event, { eq }) => eq(event.id, eventId),
      });

      if (!fetchedEvent) throw new Error("Event not found");

      const eventEndTime = DateTime.fromMillis(
        Date.parse(fetchedEvent.endDate),
      );

      const checkoutTime =
        currentTime > eventEndTime ? eventEndTime : currentTime;

      await db
        .update(rsvpTable)
        .set({
          checkoutTime: checkoutTime.toISO(),
        })
        .where(and(eq(rsvpTable.id, rsvpId), isNull(rsvpTable.checkoutTime)));
    },
    {
      connection: { host: env.REDIS_HOST, port: env.REDIS_PORT, db: 2 },
    },
  );
};

/**
 * Get upcoming events in the next 24 hours for the daily bot announcement
 */
export async function getNextEvents() {
  const startNextDay = DateTime.now().plus({ day: 1 }).startOf("day");

  const endNextDay = startNextDay.endOf("day");

  const nextEvents = await db.query.eventTable.findMany({
    where: (event) =>
      and(
        between(event.startDate, startNextDay.toISO(), endNextDay.toISO()),
        not(event.isPosted),
      ),
    with: {
      rsvps: {
        orderBy: [rsvpTable.status, rsvpTable.updatedAt],
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
  input: z.infer<typeof GetEventParamsSchema>,
): Promise<z.infer<typeof PagedEventsSchema>> {
  const { from, to, limit, type, cursor: page } = input;
  const conditions: Array<SQL | undefined> = [];

  if (from && to) {
    conditions.push(
      or(
        between(eventTable.startDate, from, to),
        between(eventTable.endDate, from, to),
      ),
    );
  } else {
    if (from) {
      conditions.push(
        or(gte(eventTable.startDate, from), gte(eventTable.endDate, from)),
      );
    }
    if (to) {
      conditions.push(
        or(lte(eventTable.startDate, to), lte(eventTable.endDate, to)),
      );
    }
  }

  if (type) {
    conditions.push(eq(eventTable.type, type));
  }

  const offset = page * limit;

  const andConditions = and(...conditions);

  const [totalEntry] = await db
    .select({
      total: count(),
    })
    .from(eventTable)
    .where(andConditions);

  if (!totalEntry) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get total events",
    });
  }

  const events = await db.query.eventTable.findMany({
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
  id: string,
): Promise<z.infer<typeof EventSchema>> {
  const dbEvent = await db.query.eventTable.findFirst({
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
  const dbEvent = await db.query.eventTable.findFirst({
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
  const eventRsvp = await db.query.rsvpTable.findFirst({
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
  eventId: string,
): Promise<Array<z.infer<typeof RSVPUserSchema>>> {
  const eventRsvps = await db.query.rsvpTable.findMany({
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
    .insert(eventTable)
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

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEvents));

  return data;
}

/**
 * Update an event
 * @param params The update parameters
 * @returns The updated event
 */
export async function updateEvent(
  params: z.infer<typeof EditEventSchema>,
): Promise<z.infer<typeof EventSchema>> {
  const { id: eventId, ...data } = params;
  const [updatedEvent] = await db
    .update(eventTable)
    .set(data)
    .where(eq(eventTable.id, eventId))
    .returning();

  if (!updatedEvent) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update event",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEvent, eventId));
  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEvents));

  const { secret, ...rest } = updatedEvent;

  return rest;
}

/**
 * Delete an event
 * @param id The id of the event
 */
export async function deleteEvent(id: string) {
  const [deletedEvent] = await db
    .delete(eventTable)
    .where(eq(eventTable.id, id))
    .returning();

  if (!deletedEvent) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete event",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEvent, id));
  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEvents));

  const { secret, ...rest } = deletedEvent;

  return rest;
}

/**
 * Edit user rsvp status
 */
export async function editUserRsvpStatus(
  userId: string,
  params: z.infer<typeof EditRSVPSelfSchema>,
) {
  const { eventId, status, delay } = params;
  const [updatedRsvp] = await db
    .insert(rsvpTable)
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
      target: [rsvpTable.eventId, rsvpTable.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update RSVP",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

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
  const dbEvent = await db.query.eventTable.findFirst({
    where: eq(eventTable.id, eventId),
  });

  if (!dbEvent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  const eventStartDateTime = DateTime.fromMillis(Date.parse(dbEvent.startDate));
  const eventEndDateTime = DateTime.fromMillis(Date.parse(dbEvent.endDate));

  const currentRSVP = await db.query.rsvpTable.findFirst({
    where: (rsvp, { and }) =>
      and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
  });

  if (currentRSVP?.checkinTime) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are already checked in",
    });
  }

  const [updatedRsvp] = await db
    .insert(rsvpTable)
    .values({
      userId,
      eventId,
      checkinTime: clampDateTime(
        DateTime.local(),
        eventStartDateTime,
        eventEndDateTime,
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
          eventEndDateTime,
        ).toISO(),
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvpTable.eventId, rsvpTable.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check in",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  const timeDiff = eventEndDateTime.toMillis() - DateTime.local().toMillis();
  const delay = timeDiff > 0 ? timeDiff : 0;

  await checkoutQueue.add(
    "checkout",
    { eventId, rsvpId: updatedRsvp.id },
    { delay, jobId: updatedRsvp.id },
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
  const dbScancode = await db.query.scancodeTable.findFirst({
    where: (scancode) => eq(scancode.code, code),
  });

  if (!dbScancode) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Scancode not found",
    });
  }

  const checkedIn = await userCheckin({
    eventId,
    userId: dbScancode.userId,
  });

  return checkedIn;
}

/**
 * Check out a user
 * @param userId The userId to check out of an event
 * @param eventId The eventId to check out of
 * @returns The updated rsvp
 */
export async function userCheckout(userId: string, eventId: string) {
  const existingRsvp = await db.query.rsvpTable.findFirst({
    where: (rsvp, { and }) =>
      and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
  });

  const existingEvent = await db.query.eventTable.findFirst({
    where: eq(eventTable.id, eventId),
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

  const existingRsvpCheckinTime = DateTime.fromMillis(
    Date.parse(existingRsvp.checkinTime),
  );
  const eventEndDateTime = DateTime.fromMillis(
    Date.parse(existingEvent.endDate),
  );

  const [updatedRsvp] = await db
    .insert(rsvpTable)
    .values({
      userId,
      eventId,
      checkoutTime: clampDateTime(
        DateTime.local(),
        existingRsvpCheckinTime,
        eventEndDateTime,
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
          eventEndDateTime,
        ).toISO(),
        updatedAt: DateTime.local().toISO(),
      },
      target: [rsvpTable.eventId, rsvpTable.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check out",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  return updatedRsvp;
}

/**
 * Edit a user's event attendance
 */
export async function editUserAttendance(
  params: z.infer<typeof EditUserAttendanceSchema>,
) {
  const { userId, eventId, checkinTime, checkoutTime } = params;

  if (checkoutTime && !checkinTime) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot check out without checking in",
    });
  }

  const [updatedRsvp] = await db
    .insert(rsvpTable)
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
      target: [rsvpTable.eventId, rsvpTable.userId],
    })
    .returning();

  if (!updatedRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update RSVP",
    });
  }

  // TODO: Schedule a job to check out the user after the delay

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  return updatedRsvp;
}

export async function selfCheckin(
  userId: string,
  params: z.infer<typeof SelfCheckinSchema>,
) {
  const { eventId, secret } = params;
  const dbEvent = await db.query.eventTable.findFirst({
    where: eq(eventTable.id, eventId),
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

  const updatedRSVP = await userCheckin({
    eventId,
    userId,
  });

  return updatedRSVP;
}

export async function createBlankUserRsvp(
  params: z.infer<typeof CreateBlankUserRsvpSchema>,
) {
  const { userId, eventId } = params;
  const [createdRsvp] = await db
    .insert(rsvpTable)
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
      target: [rsvpTable.eventId, rsvpTable.userId],
    })
    .returning();

  if (!createdRsvp) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create RSVP",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.events.getEventRsvps, eventId));

  return createdRsvp;
}

export async function getAutocompleteEvents(like?: string) {
  const events = await db.query.eventTable.findMany({
    where: (event) => {
      const conditions: Array<SQL<unknown>> = [
        gte(event.endDate, DateTime.local().toISO()),
      ];

      if (like) {
        const condition = or(
          ilike(event.title, `%${like}%`),
          ilike(event.id, `%${like}%`),
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

export async function getCurrentEvents(
  leewayMinutes = 5,
): Promise<z.infer<typeof EventWithSecretArraySchema>> {
  const now = DateTime.now().minus({ minutes: leewayMinutes }).toISO();

  const events = await db.query.eventTable.findMany({
    where: (event) => and(gte(event.startDate, now), lte(event.endDate, now)),
  });

  return events;
}

export async function markEventPosted(eventId: string) {
  const [updatedEvent] = await db
    .update(eventTable)
    .set({
      isPosted: true,
    })
    .where(eq(eventTable.id, eventId))
    .returning();

  if (!updatedEvent) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark event as posted",
    });
  }

  return updatedEvent;
}
