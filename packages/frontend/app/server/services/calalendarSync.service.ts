"use server";

import { type calendar_v3, google } from "googleapis";

import { asc, eq } from "drizzle-orm";
import { DateTime } from "luxon";
import db from "../drizzle/db";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import mainLogger from "../logger";
import { strToRegex } from "../utils/regexBuilder";

const eventLogger = mainLogger.child("Sync Events");

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

/**
 * Promisified version of the Google Calendar API events.list method
 * @param params Google Calendar API parameters
 * @returns Promise of the Google Calendar API response
 */
const promiseifiedCalEventsList = (
  params: calendar_v3.Params$Resource$Events$List,
) =>
  new Promise<calendar_v3.Schema$Events>((res, rej) => {
    calendar.events.list(params, (error, result) => {
      if (error) {
        return rej(error);
      }
      if (result === null || result === undefined) {
        return rej(new Error("Result is null or undefined"));
      }
      res(result.data);
    });
  });

let memorySyncToken: string | undefined;

/**
 * Generator function to get all calendar events
 */
async function* getCalendarEvents() {
  // if skipSyncToken is true, we want to ignore the sync token and fetch all events

  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId: env.VITE_GOOGLE_CALENDAR_ID,
    singleEvents: true,
  };

  let initialData: calendar_v3.Schema$Events;
  try {
    if (memorySyncToken) {
      eventLogger.info("Syncing events using sync token");
    }
    initialData = await promiseifiedCalEventsList({
      ...params,
      syncToken: memorySyncToken,
    });
  } catch {
    eventLogger.info("Sync token is presumed invalid, fetching all events");
    initialData = await promiseifiedCalEventsList(params);
  }

  for (const item of initialData.items ?? []) {
    yield item;
  }

  let { nextPageToken } = initialData;

  while (nextPageToken) {
    const data = await promiseifiedCalEventsList({
      ...params,
      pageToken: nextPageToken,
    });

    for (const item of data.items ?? []) {
      yield item;
    }

    nextPageToken = data.nextPageToken;
    memorySyncToken = data.nextSyncToken ?? undefined;
  }
}

/**
 * Converts a Google Calendar event to an event object
 * @param gcalEvent Google Calendar event
 * @returns Event object
 */
const googleEventToEvent = (gcalEvent: calendar_v3.Schema$Event) => {
  const allDay = !gcalEvent.start?.dateTime && !gcalEvent.end?.dateTime;

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
      ? DateTime.fromMillis(Date.parse(gcalEvent.end.date)).endOf("day").toISO()
      : null; // If the event is an all-day event, set the end date to the end of the day

  if (!startDate || !endDate) {
    throw new Error("Event start or end date is null");
  }

  const { id } = gcalEvent;

  if (!id) {
    throw new Error("Event does not have an ID");
  }

  return {
    id,
    title: gcalEvent.summary ?? "",
    startDate,
    endDate,
    description: gcalEvent.description ?? "",
    type: "Regular",
    allDay,
    isSyncedEvent: true,
  } satisfies Partial<EventInsert>;
};

/**
 * Syncs events from Google Calendar to the database
 */
export const syncEvents = async () => {
  eventLogger.time("Sync Events");

  const iteratorResult = getCalendarEvents();

  const filters = await db
    .select({
      id: eventParsingRuleTable.id,
      regex: eventParsingRuleTable.regex,
      priority: eventParsingRuleTable.priority,
    })
    .from(eventParsingRuleTable)
    .orderBy(asc(eventParsingRuleTable.priority));

  let deletedCount = 0;
  let insertedCount = 0;

  for await (const gcalEvent of iteratorResult) {
    try {
      if (!gcalEvent.id) {
        continue;
      }

      if (gcalEvent.status === "cancelled") {
        await db.delete(eventTable).where(eq(eventTable.id, gcalEvent.id));
        deletedCount++;
        continue;
      }

      const updatedEvent = googleEventToEvent(gcalEvent);

      const matchingRule = filters.find((rule) => {
        const regex = strToRegex(rule.regex);

        return (
          regex.test(updatedEvent.title) || regex.test(updatedEvent.description)
        );
      });

      const eventData = {
        ...updatedEvent,
        ruleId: matchingRule?.id,
      } satisfies EventInsert;

      await db
        .insert(eventTable)
        .values(eventData)
        .onConflictDoUpdate({
          set: eventData,
          target: [eventTable.id],
        });

      insertedCount++;
    } catch (error) {
      mainLogger.error("Failed to update event", error);
    }
  }
  eventLogger.timeEnd("Sync Events");
  eventLogger.info(`Deleted ${deletedCount} events`);
  eventLogger.info(`Inserted ${insertedCount} events`);
};
