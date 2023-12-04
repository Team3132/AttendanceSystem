import { and, eq, isNotNull, isNull } from "drizzle-orm";
import db from "../drizzle/db";
import { TRPCError } from "@trpc/server";

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

export async function getUserList() {
  const users = await db.query.user.findMany();

  return users;
}
