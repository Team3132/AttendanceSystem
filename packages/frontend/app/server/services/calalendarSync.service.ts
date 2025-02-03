"use server";

import { type calendar_v3, google } from "googleapis";

import { gte, inArray, lte } from "drizzle-orm";
import { DateTime } from "luxon";
import db from "../drizzle/db";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import mainLogger from "../logger";
import randomStr from "../utils/randomStr";
import { strToRegex } from "../utils/regexBuilder";

type EventInsert = typeof eventTable.$inferInsert;

const client = new google.auth.JWT(
  env.VITE_GOOGLE_CLIENT_EMAIL,
  undefined,
  env.VITE_GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/calendar.readonly"],
);

const calendar = google.calendar({
  version: "v3",
  auth: client,
});

const getCalendarEvents = () =>
  new Promise<calendar_v3.Schema$Events>((res) => {
    calendar.events.list(
      {
        calendarId: env.VITE_GOOGLE_CALENDAR_ID,
        timeMin: DateTime.now().toISO(),
        timeMax: DateTime.now().plus({ month: 3 }).toISO(),
        orderBy: "startTime",
        singleEvents: true,
      },
      (error, result) => {
        if (error) {
          throw error;
        }
        if (result === null || result === undefined) {
          throw new Error("Result is null or undefined");
        }
        res(result.data);
      },
    );
  });

export const syncEvents = async () => {
  const eventLogger = mainLogger.child("Sync Events");
  const events = await getCalendarEvents();
  eventLogger.time("Sync Events");
  const currentSyncedEventIds = await db.query.eventTable.findMany({
    where: (event, { and, eq }) =>
      and(
        gte(event.startDate, DateTime.now().toISO()),
        lte(event.endDate, DateTime.now().plus({ month: 3 }).toISO()),
        eq(event.isSyncedEvent, true),
      ),
  });

  /** Deleted Events */
  const deletedEventIds = currentSyncedEventIds
    .map((event) => event.id)
    .filter((eventId) => {
      return !events.items?.find((item) => item.id === eventId);
    });

  const deletedEvents = deletedEventIds.length
    ? await db
        .delete(eventTable)
        .where(inArray(eventTable.id, deletedEventIds))
        .returning()
    : [];

  const deletedEventCount = deletedEvents.length;

  mainLogger.debug(`Deleted ${deletedEventCount} events`);

  const eventItems = events.items ?? [];

  let updatedEvents = 0;

  const filters = await db
    .select({
      id: eventParsingRuleTable.id,
      regex: eventParsingRuleTable.regex,
      priority: eventParsingRuleTable.priority,
    })
    .from(eventParsingRuleTable);

  for (const gcalEvent of eventItems) {
    try {
      const secret = randomStr(8); // Generate a random secret for the event (used for on-device sign-in)

      const matchedParsingRuleId =
        filters
          .sort((a, b) => {
            const { priority: aPriority } = a;
            const { priority: bPriority } = b;

            if (aPriority < bPriority) {
              return -1; // Move a to the front
            }

            if (aPriority > bPriority) {
              return 1; // Move b to the front
            }

            return 0; // Do not change the order
          })
          .find((filter) => {
            const matchedTitle = strToRegex(filter.regex).test(
              gcalEvent.summary ?? "",
            );
            const matchedDescription = strToRegex(filter.regex).test(
              gcalEvent.description ?? "",
            );

            return matchedTitle || matchedDescription;
          })?.id ?? null; // Find the first matching rule

      const startDate = gcalEvent.start?.dateTime
        ? gcalEvent.start.dateTime
        : gcalEvent.end?.date
          ? DateTime.fromMillis(Date.parse(gcalEvent.end.date))
              .startOf("day")
              .toISO()
          : null; // If the event is an all-day event, set the start date to the start of the day

      const endDate = gcalEvent.end?.dateTime
        ? gcalEvent.end.dateTime
        : gcalEvent.end?.date
          ? DateTime.fromMillis(Date.parse(gcalEvent.end.date))
              .endOf("day")
              .toISO()
          : null; // If the event is an all-day event, set the end date to the end of the day

      const eventId = gcalEvent.id ?? null; // If the event does not have an ID, skip it

      const title = gcalEvent.summary ?? null;

      const allDay = !gcalEvent.start?.dateTime && !gcalEvent.end?.dateTime;

      if (!startDate || !endDate || !eventId || !title) {
        throw new Error("Event start or end date is null");
      }

      const updatedEvent = {
        title,
        allDay,
        startDate,
        endDate,
        description: gcalEvent.description ?? "",
        type: "Regular",
        isSyncedEvent: true,
        ruleId: matchedParsingRuleId,
      } satisfies Partial<EventInsert>;

      const newEvent = {
        id: eventId,
        secret,
        ...updatedEvent,
      } satisfies EventInsert;

      await db
        .insert(eventTable)
        .values(newEvent)
        .onConflictDoUpdate({
          set: updatedEvent,
          target: [eventTable.id],
        });

      updatedEvents++;
    } catch (error) {
      mainLogger.error("Failed to update event", error);
    }
  }

  eventLogger.timeEnd("Sync Events");
  eventLogger.info(`${updatedEvents} events updated/created`);

  return {
    updatedEvents,
    deletedEventCount,
  };
};
