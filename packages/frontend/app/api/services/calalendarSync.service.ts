"use server";

import { type calendar_v3, google } from "googleapis";

import { gte, inArray, lte } from "drizzle-orm";
import { DateTime } from "luxon";
import db from "../drizzle/db";
import { eventTable } from "../drizzle/schema";
import env from "../env";
import mainLogger from "../logger";
import randomStr from "../utils/randomStr";

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

export const getCalendarEvents = () =>
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

  for (const gcalEvent of eventItems) {
    try {
      const secret = randomStr(8);

      const isMentorEvent = gcalEvent.summary
        ? gcalEvent.summary.toLowerCase().includes("mentor")
        : false;

      const isOutreachEvent = gcalEvent.summary
        ? gcalEvent.summary.toLowerCase().includes("outreach")
        : false;

      const isSocialEvent = gcalEvent.summary
        ? gcalEvent.summary.toLowerCase().includes("social")
        : false;

      const eventType = isOutreachEvent
        ? "Outreach"
        : isMentorEvent
          ? "Mentor"
          : isSocialEvent
            ? "Social"
            : "Regular";

      const startDate = gcalEvent.start?.dateTime
        ? gcalEvent.start.dateTime
        : gcalEvent.end?.date
          ? DateTime.fromMillis(Date.parse(gcalEvent.end.date))
              .startOf("day")
              .toISO()
          : null;

      const endDate = gcalEvent.end?.dateTime
        ? gcalEvent.end.dateTime
        : gcalEvent.end?.date
          ? DateTime.fromMillis(Date.parse(gcalEvent.end.date))
              .endOf("day")
              .toISO()
          : null;

      const eventId = gcalEvent.id ?? null;

      const title = gcalEvent.summary ?? null;

      const allDay = !gcalEvent.start?.dateTime && !gcalEvent.end?.dateTime;

      if (!startDate || !endDate || !eventId || !title) {
        throw new Error("Event start or end date is null");
      }

      const newEvent = {
        id: eventId,
        title: title,
        allDay: !gcalEvent.start?.dateTime && !gcalEvent.end?.dateTime,
        startDate,
        endDate,
        description: gcalEvent.description ?? "",
        type: eventType,
        isSyncedEvent: true,
        secret,
      } satisfies EventInsert;

      const updatedEvent = {
        title,
        allDay,
        startDate,
        endDate,
        description: gcalEvent.description ?? "",
        type: eventType,
        isSyncedEvent: true,
      } satisfies Partial<EventInsert>;

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
