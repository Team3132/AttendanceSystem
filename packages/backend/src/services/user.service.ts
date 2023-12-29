import { and, count, eq, ilike, isNotNull, isNull } from "drizzle-orm";
import db from "../drizzle/db";
import { TRPCError } from "@trpc/server";
import { scancode, user } from "../drizzle/schema";
import { z } from "zod";
import { UserCreateSchema } from "../schema";
import { ee, rtrpc } from "../routers/app.router";
import { getQueryKey } from "@trpc/react-query";
import { UserListParamsSchema } from "../schema/UserListParamsSchema";
import { PagedUserSchema } from "../schema/PagedUserSchema";

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
        isNull(rsvp.checkoutTime)
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
  params: z.infer<typeof UserListParamsSchema>
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

  ee.emit("invalidate", getQueryKey(rtrpc.users.getUserScancodes, userId));

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
  ee.emit("invalidate", getQueryKey(rtrpc.users.getUserScancodes, userId));

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

  ee.emit("invalidate", getQueryKey(rtrpc.users.getUserList));

  return dbUser;
}
