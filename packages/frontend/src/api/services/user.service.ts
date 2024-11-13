"use server";

import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike, isNotNull, not } from "drizzle-orm";
import type { z } from "zod";
import db from "../drizzle/db";
import { scancodeTable, userTable } from "../drizzle/schema";
import type { UserCreateSchema } from "../schema";
import type { PagedUserSchema } from "../schema/PagedUserSchema";
import type { UserListParamsSchema } from "../schema/UserListParamsSchema";

/**
 * Gets a user from the database
 * @param userId The user ID to get
 * @returns The user object
 */
export async function getUser(userId: string) {
  const dbUser = await db.query.userTable.findFirst({
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
  return db.query.scancodeTable.findMany({
    where: (scancode) => eq(scancode.userId, userId),
  });
}

/**
 * Gets the pending RSVPs for a user
 * @param userId The user ID to get pending RSVPs for
 * @returns The pending RSVPs for the user
 */
export async function getPendingUserRsvps(userId: string) {
  const rsvps = await db.query.rsvpTable.findMany({
    where: (rsvp) =>
      and(
        eq(rsvp.userId, userId),
        isNotNull(rsvp.checkinTime),
        isNotNull(rsvp.checkoutTime),
        not(eq(rsvp.status, "ATTENDED")),
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
    .from(userTable)
    .where(ilike(userTable.username, `%${params.search}%`));

  if (totalData) {
    total = totalData.total;
  }

  const nextPage = total > offset + limit ? page + 1 : undefined;

  const users = await db.query.userTable.findMany({
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
    .from(scancodeTable)
    .where(eq(scancodeTable.code, scancodeCode))
    .limit(1);

  if (dbScancode) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Scancode already exists",
    });
  }

  const [createdScancode] = await db
    .insert(scancodeTable)
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
  // ee.emit("invalidate", getQueryKey(getUserScancodes, userId)); // Don't broadcast the user id

  return createdScancode;
}

export async function removeScancode(userId: string, code: string) {
  const [dbScancode] = await db
    .select()
    .from(scancodeTable)
    .where(and(eq(scancodeTable.userId, userId), eq(scancodeTable.code, code)))
    .limit(1);

  if (!dbScancode) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Scancode does not exist",
    });
  }

  await db
    .delete(scancodeTable)
    .where(and(eq(scancodeTable.userId, userId), eq(scancodeTable.code, code)))
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
    .insert(userTable)
    .values({
      ...userdata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: [userTable.id],
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
