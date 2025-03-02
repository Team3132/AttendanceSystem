import { trytm } from "@/utils/trytm";
import { and, count, eq, ilike, isNotNull, isNull } from "drizzle-orm";
import type { z } from "zod";
import db from "../drizzle/db";
import { scancodeTable, sessionTable, userTable } from "../drizzle/schema";
import type { UserCreateSchema } from "../schema";
import type { UserListParamsSchema } from "../schema/UserListParamsSchema";
import { ServerError } from "../utils/errors";

/**
 * Gets a user from the database
 * @param userId The user ID to get
 * @returns The user object
 */
export async function getUser(userId: string) {
  const [dbUser, dbError] = await trytm(
    db.query.userTable.findFirst({
      where: (user) => eq(user.id, userId),
    }),
  );

  if (dbError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching user",
      cause: dbError,
    });
  }

  if (!dbUser) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return dbUser;
}

/**
 * Gets the scancodes for a user
 * @param userId The user ID to get scancodes for
 * @returns The scancodes for the user
 */
export async function getUserScancodes(userId: string) {
  const [scancodes, dberror] = await trytm(
    db.query.scancodeTable.findMany({
      where: (scancode) => eq(scancode.userId, userId),
    }),
  );

  if (dberror) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching scancodes",
      cause: dberror,
    });
  }

  return scancodes;
}

/**
 * Gets the pending RSVPs for a user
 * @param userId The user ID to get pending RSVPs for
 * @returns The pending RSVPs for the user
 */
export async function getPendingUserRsvps(userId: string) {
  const [rsvps, dbError] = await trytm(
    db.query.rsvpTable.findMany({
      where: (rsvp) =>
        and(
          eq(rsvp.userId, userId),
          isNotNull(rsvp.checkinTime),
          isNull(rsvp.checkoutTime),
        ),
      with: {
        event: {
          columns: {
            allDay: true,
            description: true,
            endDate: true,
            id: true,
            isSyncedEvent: true,
            secret: false,
            startDate: true,
            title: true,
            type: true,
            isPosted: true,
            ruleId: true,
          },
        },
      },
    }),
  );

  if (dbError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching rsvps",
      cause: dbError,
    });
  }

  return rsvps;
}

export async function getUserList(
  params: z.infer<typeof UserListParamsSchema>,
) {
  const { limit, cursor: page } = params;

  const offset = page * limit;

  let total = 0;

  const [totalsData, totalDberror] = await trytm(
    db
      .select({
        total: count(),
      })
      .from(userTable)
      .where(ilike(userTable.username, `%${params.search}%`)),
  );

  if (totalDberror) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching total",
      cause: totalDberror,
    });
  }

  const totalData = totalsData[0];

  if (totalData) {
    total = totalData.total;
  }

  const nextPage = total > offset + limit ? page + 1 : undefined;

  const [users, userFetchError] = await trytm(
    db.query.userTable.findMany({
      where: (user) => ilike(user.username, `%${params.search}%`),
      limit,
      offset,
      columns: {
        id: true,
        username: true,
      },
    }),
  );

  if (userFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching users",
      cause: userFetchError,
    });
  }

  return {
    items: users,
    page,
    total,
    nextPage,
  };
}

export async function createUserScancode(userId: string, scancodeCode: string) {
  const [dbScancodes, dbScancodeError] = await trytm(
    db
      .select()
      .from(scancodeTable)
      .where(eq(scancodeTable.code, scancodeCode))
      .limit(1),
  );

  if (dbScancodeError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching scancode",
      cause: dbScancodeError,
    });
  }

  const dbScancode = dbScancodes[0];

  if (dbScancode) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "Scancode already exists",
    });
  }

  const [createdScancodes, createError] = await trytm(
    db
      .insert(scancodeTable)
      .values({
        userId,
        code: scancodeCode,
      })
      .returning(),
  );

  if (createError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating scancode",
      cause: createError,
    });
  }

  const createdScancode = createdScancodes[0];

  if (!createdScancode) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "Scancode does not exist",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.users.getUserScancodes, userId)); // Don't broadcast the user id
  // ee.emit("invalidate", getQueryKey(getUserScancodes, userId)); // Don't broadcast the user id

  return createdScancode;
}

export async function removeScancode(userId: string, code: string) {
  const [dbScancodes, scancodesError] = await trytm(
    db
      .select()
      .from(scancodeTable)
      .where(
        and(eq(scancodeTable.userId, userId), eq(scancodeTable.code, code)),
      )
      .limit(1),
  );

  if (scancodesError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching scancode",
      cause: scancodesError,
    });
  }

  const dbScancode = dbScancodes[0];

  if (!dbScancode) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "Scancode does not exist",
    });
  }

  const [deletedScancodes, deleteScancodesError] = await trytm(
    db
      .delete(scancodeTable)
      .where(
        and(eq(scancodeTable.userId, userId), eq(scancodeTable.code, code)),
      )
      .returning(),
  );

  if (deleteScancodesError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting scancode",
      cause: deleteScancodesError,
    });
  }

  const deletedScancode = deletedScancodes[0];

  if (!deletedScancode) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "Scancode does not exist",
    });
  }

  // if (!deletedScancode) {
  //   throw new ServerError({
  //     code: "BAD_REQUEST",
  //     message: "Scancode does not exist",
  //   });
  // }
  // ee.emit("invalidate", getQueryKey(rtrpc.users.getUserScancodes, userId)); // Don't broadcast the user id

  return dbScancode;
}

export async function createUser(userdata: z.infer<typeof UserCreateSchema>) {
  const [dbUsers, dbUsersError] = await trytm(
    db
      .insert(userTable)
      .values({
        ...userdata,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userTable.id],
        set: {
          ...userdata,
          updatedAt: new Date(),
        },
      })
      .returning(),
  );

  if (dbUsersError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating user",
      cause: dbUsersError,
    });
  }

  const [dbUser] = dbUsers;

  if (!dbUser) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "User does not exist",
    });
  }

  return dbUser;
}

export async function getUserSessions(userId: string) {
  const [sessions, sessionsError] = await trytm(
    db.query.sessionTable.findMany({
      where: eq(sessionTable.userId, userId),
    }),
  );

  if (sessionsError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching sessions",
      cause: sessionsError,
    });
  }

  return sessions;
}
