import { trytm } from "@/utils/trytm";
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
import { eventQueryKeys } from "../queryKeys";
import type { RSVPUserSchema, UserCheckinSchema } from "../schema";
import type { CreateUserRsvpSchema } from "../schema/CreateBlankUserRsvpSchema";
import type { CreateEventSchema } from "../schema/CreateEventSchema";
import type { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import type { EventSchema } from "../schema/EventSchema";
import type { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import type { ScaninSchema } from "../schema/ScaninSchema";
import type { SelfCheckinSchema } from "../schema/SelfCheckinSchema";
import clampDateTime from "../utils/clampDateTime";
import { ServerError } from "../utils/errors";
import ee from "../utils/eventEmitter";
import randomStr from "../utils/randomStr";

/**
 * Get upcoming events in the next 24 hours for the daily bot announcement
 */
export async function getNextEvents() {
  const startNextDay = DateTime.now().plus({ day: 1 }).startOf("day");

  const endNextDay = startNextDay.endOf("day");

  const [nextEvents, nextEventsError] = await trytm(
    db.query.eventTable.findMany({
      where: (event) =>
        and(
          between(
            event.startDate,
            startNextDay.toJSDate(),
            endNextDay.toJSDate(),
          ),
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
    }),
  );

  if (nextEventsError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get next events",
    });
  }

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
export async function getEvents(input: z.infer<typeof GetEventParamsSchema>) {
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

  const [totalEntriesData, totalEntriesError] = await trytm(
    db
      .select({
        total: count(),
      })
      .from(eventTable)
      .where(andConditions),
  );

  if (totalEntriesError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get total events",
      cause: totalEntriesError,
    });
  }

  const [totalEntry] = totalEntriesData;

  if (!totalEntry) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get total events",
    });
  }

  const [events, eventFetchError] = await trytm(
    db.query.eventTable.findMany({
      where: andConditions,
      limit,
      offset,
      orderBy: (event) => [asc(event.startDate)],
      columns: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
      },
    }),
  );

  if (eventFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get events",
      cause: eventFetchError,
    });
  }

  const { total } = totalEntry;

  /** Undefined if no next page */
  const nextPage = total > offset + limit ? page + 1 : undefined;

  return {
    items: events,
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
  const [dbEvent, dbError] = await trytm(
    db.query.eventTable.findFirst({
      where: (event) => eq(event.id, id),
    }),
  );

  if (dbError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event",
      cause: dbError,
    });
  }

  if (!dbEvent) {
    throw new ServerError({
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
  const [dbEvent, dbError] = await trytm(
    db.query.eventTable.findFirst({
      where: (event) => eq(event.id, id),
    }),
  );

  if (dbError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event",
      cause: dbError,
    });
  }

  if (!dbEvent) {
    throw new ServerError({
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
  const [eventRsvp, eventError] = await trytm(
    db.query.rsvpTable.findFirst({
      where: (rsvp, { and }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    }),
  );

  if (eventError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event rsvp",
      cause: eventError,
    });
  }

  return eventRsvp ?? null;
}

/**
 * Get the RSVPs of an event with the user's details
 * @param eventId The id of the event
 */
export async function getEventRsvps(
  eventId: string,
): Promise<Array<z.infer<typeof RSVPUserSchema>>> {
  const [eventRsvps, eventRsvpFetchError] = await trytm(
    db
      .select()
      .from(rsvpTable)
      .innerJoin(userTable, eq(rsvpTable.userId, userTable.id))
      .where(eq(rsvpTable.eventId, eventId))
      .orderBy(asc(userTable.username)),
  );

  if (eventRsvpFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event rsvps",
      cause: eventRsvpFetchError,
    });
  }

  const formatted = eventRsvps.map(({ user, rsvp }) => {
    return {
      ...rsvp,
      user: user,
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
  const [createdEvents, dbInserterror] = await trytm(
    db
      .insert(eventTable)
      .values({
        ...params,
        secret: randomStr(8),
      })
      .returning(),
  );

  if (dbInserterror) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create event",
      cause: dbInserterror,
    });
  }

  const [createdEvent] = createdEvents;

  if (!createdEvent) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create event",
      cause: dbInserterror,
    });
  }

  const { secret, ...data } = createdEvent;

  ee.emit("invalidate", eventQueryKeys.eventsList);

  return data;
}

/**
 * Edit user rsvp status
 */
export async function editUserRsvpStatus(
  userId: string,
  params: z.infer<typeof EditRSVPSelfSchema>,
) {
  const { eventId, status, arrivingAt } = params;
  const [existingRsvp, rsvpFetchError] = await trytm(
    db.query.rsvpTable.findFirst({
      where: (rsvp, { and }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    }),
  );

  if (rsvpFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch exsisting RSVP",
      cause: rsvpFetchError,
    });
  }

  if (existingRsvp?.status === "ATTENDED") {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "User ihas already attended the event",
    });
  }

  const [updatedRsvps, rsvpUpdateError] = await trytm(
    db
      .insert(rsvpTable)
      .values({
        userId,
        eventId,
        status,
        arrivingAt,
      })
      .onConflictDoUpdate({
        set: {
          userId,
          eventId,
          status,
          arrivingAt,
        },
        target: [rsvpTable.eventId, rsvpTable.userId],
      })
      .returning(),
  );

  if (rsvpUpdateError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update RSVP",
      cause: rsvpUpdateError,
    });
  }

  const [updatedRsvp] = updatedRsvps;

  if (!updatedRsvp) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update RSVP",
      cause: rsvpUpdateError,
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
  const [dbEvent, dbEventError] = await trytm(
    db.query.eventTable.findFirst({
      where: eq(eventTable.id, eventId),
    }),
  );

  if (dbEventError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event",
      cause: dbEventError,
    });
  }

  if (!dbEvent) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  const eventStartDateTime = DateTime.fromJSDate(dbEvent.startDate);
  const eventEndDateTime = DateTime.fromJSDate(dbEvent.endDate);

  const [currentRSVP, rsvpFetchError] = await trytm(
    db.query.rsvpTable.findFirst({
      where: (rsvp, { and }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    }),
  );

  if (rsvpFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch RSVP",
      cause: rsvpFetchError,
    });
  }

  if (currentRSVP?.checkinTime) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "You are already checked in",
    });
  }

  const checkinTime = clampDateTime(
    DateTime.local(),
    eventStartDateTime,
    eventEndDateTime,
  ).toJSDate();

  const [updatedRSVPs, updateRSVPError] = await trytm(
    db
      .insert(rsvpTable)
      .values({
        userId,
        eventId,
        checkinTime: checkinTime,
        status: "ATTENDED",
      })
      .onConflictDoUpdate({
        set: {
          userId,
          eventId,
          checkinTime: checkinTime,
          status: "ATTENDED",
        },
        target: [rsvpTable.eventId, rsvpTable.userId],
      })
      .returning(),
  );

  if (updateRSVPError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check in",
      cause: updateRSVPError,
    });
  }

  const [updatedRsvp] = updatedRSVPs;

  if (!updatedRsvp) {
    throw new ServerError({
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
  const [dbScancode, dbFetchError] = await trytm(
    db.query.scancodeTable.findFirst({
      where: (scancode) => eq(scancode.code, code),
    }),
  );

  if (dbFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch scancode",
      cause: dbFetchError,
    });
  }

  if (!dbScancode) {
    throw new ServerError({
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
  const [existingRsvp, existingRSVPError] = await trytm(
    db.query.rsvpTable.findFirst({
      where: (rsvp, { and }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    }),
  );

  if (existingRSVPError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch RSVP",
      cause: existingRSVPError,
    });
  }

  const [existingEvent, existingEventError] = await trytm(
    db.query.eventTable.findFirst({
      where: eq(eventTable.id, eventId),
    }),
  );

  if (existingEventError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event",
      cause: existingEventError,
    });
  }

  if (!existingRsvp) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "RSVP not found, please check in first",
    });
  }

  if (!existingEvent) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  if (!existingRsvp.checkinTime) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "User is not checked in",
    });
  }

  if (existingRsvp.checkoutTime !== null) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "User is already checked out",
    });
  }

  const existingRsvpCheckinTime = DateTime.fromJSDate(existingRsvp.checkinTime);
  const eventEndDateTime = DateTime.fromJSDate(existingEvent.endDate);

  const [updatedRsvps, rsvpUpdateError] = await trytm(
    db
      .insert(rsvpTable)
      .values({
        userId,
        eventId,
        checkoutTime: clampDateTime(
          DateTime.local(),
          existingRsvpCheckinTime,
          eventEndDateTime,
        ).toJSDate(),
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
          ).toJSDate(),
          status: "ATTENDED",
        },
        target: [rsvpTable.eventId, rsvpTable.userId],
      })
      .returning(),
  );

  if (rsvpUpdateError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check out",
      cause: rsvpUpdateError,
    });
  }

  const [updatedRsvp] = updatedRsvps;

  if (!updatedRsvp) {
    throw new ServerError({
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
  const [dbEvent, dbEventError] = await trytm(
    db.query.eventTable.findFirst({
      where: eq(eventTable.id, eventId),
    }),
  );

  if (dbEventError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event",
      cause: dbEventError,
    });
  }

  if (!dbEvent) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  if (dbEvent.secret !== secret) {
    throw new ServerError({
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
  const { userId, eventId, checkinTime, checkoutTime, status, arrivingAt } =
    params;

  if (checkoutTime && !checkinTime) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "Cannot check out without checking in",
    });
  }

  if (checkinTime && checkoutTime) {
    if (DateTime.fromJSDate(checkinTime) > DateTime.fromJSDate(checkoutTime)) {
      throw new ServerError({
        code: "BAD_REQUEST",
        message: "Checkin time must be before checkout time",
      });
    }
  }

  const [createdRsvps, rsvpCreateError] = await trytm(
    db
      .insert(rsvpTable)
      .values({
        userId,
        eventId,
        checkinTime,
        checkoutTime,
        status: checkinTime ? "ATTENDED" : status,
        arrivingAt,
      })
      .onConflictDoUpdate({
        set: {
          userId,
          eventId,
          checkinTime,
          checkoutTime,
          status: checkinTime ? "ATTENDED" : status,
          arrivingAt,
        },
        target: [rsvpTable.eventId, rsvpTable.userId],
      })
      .returning(),
  );

  if (rsvpCreateError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create RSVP",
      cause: rsvpCreateError,
    });
  }

  const [createdRsvp] = createdRsvps;

  if (!createdRsvp) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create RSVP",
    });
  }

  ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));

  return createdRsvp;
}

export async function getAutocompleteEvents(like?: string) {
  const [events, eventsError] = await trytm(
    db.query.eventTable.findMany({
      where: (event) => {
        const conditions: Array<SQL<unknown>> = [
          gte(event.endDate, DateTime.local().toJSDate()),
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
    }),
  );

  if (eventsError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch events",
      cause: eventsError,
    });
  }

  return events;
}

export async function markEventPosted(eventId: string) {
  const [updatedEvents, updateEventsError] = await trytm(
    db
      .update(eventTable)
      .set({
        isPosted: true,
      })
      .where(eq(eventTable.id, eventId))
      .returning(),
  );

  if (updateEventsError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark event as posted",
      cause: updateEventsError,
    });
  }

  const [updatedEvent] = updatedEvents;

  if (!updatedEvent) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark event as posted",
    });
  }

  return updatedEvent;
}
