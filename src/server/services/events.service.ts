import { sessionMiddleware } from "@/middleware/authMiddleware";
import { trytm } from "@/utils/trytm";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { type SQL, and, asc, between, eq, gte, lte, or } from "drizzle-orm";
import { DateTime } from "luxon";
import type { z } from "zod";
import { eventTable, rsvpTable, userTable } from "../drizzle/schema";
import type { CreateUserRsvpSchema } from "../schema/CreateBlankUserRsvpSchema";
import type { EditRSVPSelfSchema } from "../schema/EditRSVPSelfSchema";
import { GetEventParamsSchema } from "../schema/GetEventParamsSchema";
import type { RSVPUserSchema } from "../schema/RSVPUserSchema";
import type { ScaninSchema } from "../schema/ScaninSchema";
import type { SelfCheckinSchema } from "../schema/SelfCheckinSchema";
import type { UserCheckinSchema } from "../schema/UserCheckinSchema";
import clampDateTime from "../utils/clampDateTime";
import { getServerContext } from "../utils/context";
import { buildConflictUpdateColumns } from "../utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "../utils/db/buildSetWhereColumns";
import { ServerError } from "../utils/errors";

/**
 * Get events
 * @param input Parameters for the query
 * @returns A list of events
 */
export const getEvents = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .inputValidator(GetEventParamsSchema)
  .handler(async ({ data, context: { db } }) => {
    const { from, to, limit, cursor: page } = data;
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

    const offset = page * limit;

    const andConditions = and(...conditions);

    const [total, totalEntriesError] = await trytm(
      db.$count(eventTable, andConditions),
    );

    if (totalEntriesError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get total events",
        cause: totalEntriesError,
      });
    }

    const [events, eventFetchError] = await trytm(
      db.query.eventTable.findMany({
        where: andConditions,
        limit,
        offset,
        orderBy: (event, { asc }) => [asc(event.startDate)],
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

    /** Undefined if no next page */
    const nextPage = total > offset + limit ? page + 1 : undefined;

    return {
      items: events,
      page,
      total,
      nextPage,
    };
  });

/**
 * Get an event by id
 * @param id The id of the event
 * @returns The event
 */
export const getEvent = createServerOnlyFn(async (id: string) => {
  const { db } = getServerContext();

  const [dbEvent, dbError] = await trytm(
    db.query.eventTable.findFirst({
      where: (event, { eq }) => eq(event.id, id),
      with: {
        rule: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
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
});

/**
 * Get the secret of an event
 * @param id The id of the event
 * @returns The secret of the event
 */
export const getEventSecret = createServerOnlyFn(
  async (
    id: string,
  ): Promise<{
    secret: string;
  }> => {
    const { db } = getServerContext();

    const [dbEvent, dbError] = await trytm(
      db.query.eventTable.findFirst({
        where: (event, { eq }) => eq(event.id, id),
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
  },
);

/**
 * Get the RSVP of a user for an event
 * @param eventId The id of the event
 * @param userId The id of the user
 * @returns The RSVP of the user for the event
 */
export const getEventRsvp = createServerOnlyFn(
  async (eventId: string, userId: string) => {
    const { db } = getServerContext();

    const [eventRsvp, eventError] = await trytm(
      db.query.rsvpTable.findFirst({
        where: (rsvp, { and, eq }) =>
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
  },
);

/**
 * Get the RSVPs of an event with the user's details
 * @param eventId The id of the event
 */
export const getEventRsvps = createServerOnlyFn(
  async (eventId: string): Promise<Array<z.infer<typeof RSVPUserSchema>>> => {
    const { db } = getServerContext();

    const [eventRsvps, eventRsvpFetchError] = await trytm(
      db
        .select()
        .from(rsvpTable)
        .innerJoin(userTable, (rsvp) => eq(rsvp.userId, userTable.id))
        .where(({ rsvp }) => eq(rsvp.eventId, eventId))
        .orderBy(({ user }) => asc(user.username)),
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
  },
);

/**
 * Edit user rsvp status
 */
export const editUserRsvpStatus = createServerOnlyFn(
  async (userId: string, params: z.infer<typeof EditRSVPSelfSchema>) => {
    const { db } = getServerContext();

    const { eventId, status, arrivingAt } = params;
    const [existingRsvp, rsvpFetchError] = await trytm(
      db.query.rsvpTable.findFirst({
        where: (rsvp, { and, eq }) =>
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
        message: "User has already attended the event",
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
          target: [rsvpTable.eventId, rsvpTable.userId],
          set: buildConflictUpdateColumns(rsvpTable, ["status", "arrivingAt"]),
          setWhere: buildSetWhereColumns(rsvpTable, ["status", "arrivingAt"]),
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

    // ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));
    // pubSub.publish("event:rsvpUpdated", eventId, {
    //   rsvpId: updatedRsvp.id,
    //   status: updatedRsvp.status,
    //   userId: userId,
    // });

    return updatedRsvp;
  },
);

/**
 * Check in a user, mentor only
 * @param userId The id of the user to check in
 * @param params The checkin parameters
 * @returns The updated rsvp
 */
const userCheckin = createServerOnlyFn(
  async (params: z.infer<typeof UserCheckinSchema>) => {
    const { db } = getServerContext();

    const { eventId, userId } = params;
    const [dbEvent, dbEventError] = await trytm(
      db.query.eventTable.findFirst({
        where: (table, { eq }) => eq(table.id, eventId),
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
        where: (rsvp, { and, eq }) =>
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
          set: buildConflictUpdateColumns(rsvpTable, ["checkinTime", "status"]),
          setWhere: buildSetWhereColumns(rsvpTable, ["checkinTime", "status"]),
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

    // ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));
    // pubSub.publish("event:rsvpUpdated", eventId, {
    //   rsvpId: updatedRsvp.id,
    //   status: updatedRsvp.status,
    //   userId: userId,
    // });
    console.log("Published RSVP update for event:", eventId);

    return updatedRsvp;
  },
);

/**
 * Scan in a user using a scancode, mentor only
 * @param userId The id of the user to check in
 * @param params The scanin parameters (code)
 * @returns The updated rsvp
 */
export const userScanin = createServerOnlyFn(
  async (params: z.infer<typeof ScaninSchema>) => {
    const { db } = getServerContext();

    const { eventId, scancode: code } = params;

    // find scancode
    const [dbScancode, dbFetchError] = await trytm(
      db.query.scancodeTable.findFirst({
        where: (scancode, { eq }) => eq(scancode.code, code),
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
  },
);

/**
 * Check out a user
 * @param userId The userId to check out of an event
 * @param eventId The eventId to check out of
 * @returns The updated rsvp
 */
export const userCheckout = createServerOnlyFn(
  async (userId: string, eventId: string) => {
    const { db } = getServerContext();

    const [existingRsvp, existingRSVPError] = await trytm(
      db.query.rsvpTable.findFirst({
        where: (rsvp, { and, eq }) =>
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
        where: (table, { eq }) => eq(table.id, eventId),
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

    const existingRsvpCheckinTime = DateTime.fromJSDate(
      existingRsvp.checkinTime,
    );
    const eventEndDateTime = DateTime.fromJSDate(existingEvent.endDate);

    const checkoutTime = clampDateTime(
      DateTime.local(),
      existingRsvpCheckinTime,
      eventEndDateTime,
    ).toJSDate();

    const [updatedRsvps, rsvpUpdateError] = await trytm(
      db
        .insert(rsvpTable)
        .values({
          userId,
          eventId,
          checkoutTime,
          status: "ATTENDED",
        })
        .onConflictDoUpdate({
          set: buildConflictUpdateColumns(rsvpTable, [
            "checkoutTime",
            "status",
          ]),
          setWhere: buildSetWhereColumns(rsvpTable, ["checkoutTime", "status"]),
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

    // ee.emit("invalidate", eventQueryKeys.eventRsvps(eventId));
    // pubSub.publish("event:rsvpUpdated", eventId, {
    //   rsvpId: updatedRsvp.id,
    //   status: updatedRsvp.status,
    //   userId: userId,
    // });

    return updatedRsvp;
  },
);

export const selfCheckin = createServerOnlyFn(
  async (userId: string, params: z.infer<typeof SelfCheckinSchema>) => {
    const { eventId, secret } = params;

    const { db } = getServerContext();

    const [dbEvent, dbEventError] = await trytm(
      db.query.eventTable.findFirst({
        where: (table, { eq }) => eq(table.id, eventId),
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
  },
);

export const createUserRsvp = createServerOnlyFn(
  async (params: z.infer<typeof CreateUserRsvpSchema>) => {
    const { userId, eventId, checkinTime, checkoutTime, status, arrivingAt } =
      params;

    const { db } = getServerContext();

    if (checkoutTime && !checkinTime) {
      throw new ServerError({
        code: "BAD_REQUEST",
        message: "Cannot check out without checking in",
      });
    }

    if (checkinTime && checkoutTime) {
      if (
        DateTime.fromJSDate(checkinTime) > DateTime.fromJSDate(checkoutTime)
      ) {
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
          set: buildConflictUpdateColumns(rsvpTable, [
            "checkinTime",
            "checkoutTime",
            "status",
            "arrivingAt",
          ]),
          setWhere: buildSetWhereColumns(rsvpTable, [
            "checkinTime",
            "checkoutTime",
            "status",
            "arrivingAt",
          ]),
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

    // pubSub.publish("event:rsvpUpdated", eventId, {
    //   rsvpId: createdRsvp.id,
    //   status: createdRsvp.status,
    //   userId: userId,
    // });

    return createdRsvp;
  },
);

export const getAutocompleteEvents = createServerOnlyFn(
  async (like?: string) => {
    const { db } = getServerContext();

    const [events, eventsError] = await trytm(
      db.query.eventTable.findMany({
        where: (event, { gte, or, ilike, and }) => {
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
        orderBy: (event, { asc }) => [asc(event.startDate)],
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
  },
);

export const markEventPosted = createServerOnlyFn(async (eventId: string) => {
  const { db } = getServerContext();

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
});
