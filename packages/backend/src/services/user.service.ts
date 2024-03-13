import { getQueryKey } from "@trpc/react-query";
import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";
import db from "../drizzle/db";
import { buildPoints, scancode, user } from "../drizzle/schema";
import { ee } from "../routers/app.router";
import { AddBuildPointsUserSchema, UserCreateSchema } from "../schema";
import { GetBuildPointsSchema } from "../schema/GetBuildPointsSchema";
import { PagedBuildPointsSchema } from "../schema/PagedBuildPointsSchema";
import { PagedUserSchema } from "../schema/PagedUserSchema";
import { RemoveBuildPointSchema } from "../schema/RemoveBuildPointSchema";
import { UserListParamsSchema } from "../schema/UserListParamsSchema";

/**
 * Gets a user from the database
 * @param userId The user ID to get
 * @returns The user object
 */
export async function getUser(userId: string) {
  const dbUser = await db.query.user.findFirst({
    where: (user) => eq(user.id, userId),
  });

  if (!dbUser) {
    throw new TRPCError({
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
export function getUserScancodes(userId: string) {
  return db.query.scancode.findMany({
    where: (scancode) => eq(scancode.userId, userId),
  });
}

/**
 * Gets the pending RSVPs for a user
 * @param userId The user ID to get pending RSVPs for
 * @returns The pending RSVPs for the user
 */
export async function getPendingUserRsvps(userId: string) {
  const rsvps = await db.query.rsvp.findMany({
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
        },
      },
    },
  });

  return rsvps;
}

export async function getUserList(
  params: z.infer<typeof UserListParamsSchema>,
): Promise<z.infer<typeof PagedUserSchema>> {
  const { limit, cursor: page } = params;

  const offset = page * limit;

  let total = 0;

  const [totalData] = await db
    .select({
      total: count(),
    })
    .from(user)
    .where(ilike(user.username, `%${params.search}%`));

  if (totalData) {
    total = totalData.total;
  }

  const nextPage = total > offset + limit ? page + 1 : undefined;

  const users = await db.query.user.findMany({
    where: (user) => ilike(user.username, `%${params.search}%`),
    limit,
    offset,
  });

  return {
    items: users,
    page,
    total,
    nextPage,
  };
}

export async function createUserScancode(userId: string, scancodeCode: string) {
  const [dbScancode] = await db
    .select()
    .from(scancode)
    .where(eq(scancode.code, scancodeCode))
    .limit(1);

  if (dbScancode) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Scancode already exists",
    });
  }

  const [createdScancode] = await db
    .insert(scancode)
    .values({
      userId,
      code: scancodeCode,
    })
    .returning();

  if (!createdScancode) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Scancode does not exist",
    });
  }

  // ee.emit("invalidate", getQueryKey(rtrpc.users.getUserScancodes, userId)); // Don't broadcast the user id

  return createdScancode;
}

export async function removeScancode(userId: string, code: string) {
  const [dbScancode] = await db
    .select()
    .from(scancode)
    .where(and(eq(scancode.userId, userId), eq(scancode.code, code)))
    .limit(1);

  if (!dbScancode) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Scancode does not exist",
    });
  }

  await db
    .delete(scancode)
    .where(and(eq(scancode.userId, userId), eq(scancode.code, code)))
    .returning();

  // if (!deletedScancode) {
  //   throw new TRPCError({
  //     code: "BAD_REQUEST",
  //     message: "Scancode does not exist",
  //   });
  // }
  // ee.emit("invalidate", getQueryKey(rtrpc.users.getUserScancodes, userId)); // Don't broadcast the user id

  return dbScancode;
}

export async function createUser(userdata: z.infer<typeof UserCreateSchema>) {
  const [dbUser] = await db
    .insert(user)
    .values({
      ...userdata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: [user.id],
      set: {
        ...userdata,
        updatedAt: new Date().toISOString(),
      },
    })
    .returning();

  if (!dbUser) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User does not exist",
    });
  }

  return dbUser;
}

export async function addUserBuildPoints(
  params: z.infer<typeof AddBuildPointsUserSchema>,
) {
  const user = await db.query.user.findFirst({
    where: (user) => eq(user.id, params.userId),
  });

  if (!user) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "User does not exist, cannot add build points. Please register by rsvp'ing to an event first.",
    });
  }

  const [newBuildPoints] = await db
    .insert(buildPoints)
    .values({
      userId: params.userId,
      points: params.points,
      reason: params.reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  if (!newBuildPoints) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to add build points",
    });
  }

  return newBuildPoints;
}

export async function getUserBuildPoints(
  userId: string,
  params: z.infer<typeof GetBuildPointsSchema>,
) {
  const { limit, cursor: page } = params;

  const offset = page * limit;

  let total = 0;

  const [totalData] = await db
    .select({
      total: count(),
    })
    .from(buildPoints)
    .where(eq(buildPoints.userId, userId));

  if (totalData) {
    total = totalData.total;
  }

  const nextPage = total > offset + limit ? page + 1 : undefined;

  const buildPointsRes = await db.query.buildPoints.findMany({
    where: (buildPoints) => eq(buildPoints.userId, userId),
    limit,
    offset,
  });

  return {
    items: buildPointsRes,
    page,
    total,
    nextPage,
  } satisfies z.infer<typeof PagedBuildPointsSchema>;
}

export async function removeUserBuildPoints(
  params: z.infer<typeof RemoveBuildPointSchema>,
) {
  const { buildPointId } = params;
  const [res] = await db
    .delete(buildPoints)
    .where(eq(buildPoints.id, buildPointId))
    .returning();

  if (!res) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Build point does not exist or has already been removed",
    });
  }

  return res;
}
