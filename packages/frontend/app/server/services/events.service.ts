"use server";

import { TRPCError } from "@trpc/server";
import {
  type SQL,
  and,
  asc,
  between,
  count,
  eq,
  gte,
  ilike,
  lte,
  not,
  or,
} from "drizzle-orm";
import { DateTime } from "luxon";
import type { z } from "zod";
import db from "../drizzle/db";
import { eventTable, rsvpTable, userTable } from "../drizzle/schema";
import type { RSVPUserSchema, UserCheckinSchema } from "../schema";
import type { CreateUserRsvpSchema } from "../schema/CreateBlankUserRsvpSchema";
import type { CreateEventSchema } from "../schema/CreateEventSchema";
import type { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import type { EventSchema } from "../schema/EventSchema";
import type { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import type { PagedEventsSchema } from "../schema/PagedEventsSchema";
import type { ScaninSchema } from "../schema/ScaninSchema";
import type { SelfCheckinSchema } from "../schema/SelfCheckinSchema";
import clampDateTime from "../utils/clampDateTime";
import randomStr from "../utils/randomStr";
import { eventQueryKeys } from "../queryKeys";
import ee from "../utils/eventEmitter";

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
  // const eventRsvps = await db.query.rsvpTable.findMany({
  //   where: (rsvp, { and }) => and(eq(rsvp.eventId, eventId)),
  //   orderBy: (rsvp) => [asc(rsvp.updatedAt)],
  //   with: {
  //     user: true,
  //   },
  // });

  const eventRsvps = await db
    .select()
    .from(rsvpTable)
    .innerJoin(userTable, eq(rsvpTable.userId, userTable.id))
    .where(eq(rsvpTable.eventId, eventId))
    .orderBy(asc(userTable.username));

  const formatted = eventRsvps.map(({ User, RSVP }) => {
    return {
      ...RSVP,
      user: User,
    };
  });

  return formatted;
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

  ee.emit("invalidate", eventQueryKeys.eventsList);

  return data;
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

  ee.emit("invalidate", eventQueryKeys.eventsList);
  ee.emit("invalidate", eventQueryKeys.eventDetails(id));

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
  const existingRsvp = await db.query.rsvpTable.findFirst({
    where: (rsvp, { and }) =>
      and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
  });

  if (existingRsvp?.status === "ATTENDED") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ihas already attended the event",
    });
  }

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

  ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));

  return updatedRsvp;
}

/**
 * Check in a user, mentor only
 * @param userId The id of the user to check in
 * @param params The checkin parameters
 * @returns The updated rsvp
 */
async function userCheckin(params: z.infer<typeof UserCheckinSchema>) {
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

  const checkinTime = clampDateTime(
    DateTime.local(),
    eventStartDateTime,
    eventEndDateTime,
  ).toISO();

  const [updatedRsvp] = await db
    .insert(rsvpTable)
    .values({
      userId,
      eventId,
      checkinTime: checkinTime,
      status: "ATTENDED",
      updatedAt: DateTime.local().toISO(),
      createdAt: DateTime.local().toISO(),
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        checkinTime: checkinTime,
        status: "ATTENDED",
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

  ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));

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

  if (existingRsvp.checkoutTime !== null) {
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
      status: "ATTENDED",
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
        status: "ATTENDED",
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

  ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));

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

export async function createUserRsvp(
  params: z.infer<typeof CreateUserRsvpSchema>,
) {
  const { userId, eventId, checkinTime, checkoutTime, status } = params;

  if (checkoutTime && !checkinTime) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot check out without checking in",
    });
  }

  if (checkinTime && checkoutTime) {
    if (DateTime.fromISO(checkinTime) > DateTime.fromISO(checkoutTime)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Checkin time must be before checkout time",
      });
    }
  }

  const [createdRsvp] = await db
    .insert(rsvpTable)
    .values({
      userId,
      eventId,
      createdAt: DateTime.local().toISO(),
      updatedAt: DateTime.local().toISO(),
      checkinTime,
      checkoutTime,
      status: checkinTime ? "ATTENDED" : status,
    })
    .onConflictDoUpdate({
      set: {
        userId,
        eventId,
        updatedAt: DateTime.local().toISO(),
        checkinTime,
        checkoutTime,
        status: checkinTime ? "ATTENDED" : status,
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

  ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));

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
