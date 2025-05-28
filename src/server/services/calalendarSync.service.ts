import { type calendar_v3, google } from "googleapis";

import { trytm } from "@/utils/trytm";
import { asc, inArray } from "drizzle-orm";
import { DateTime } from "luxon";
import db from "../drizzle/db";
import { kv } from "../drizzle/kv";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import mainLogger from "../logger";
import type { ColumnNames } from "../utils/db/ColumnNames";
import { buildConflictUpdateColumns } from "../utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "../utils/db/buildSetWhereColumns";
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

/**
 * Generator function to get all calendar events
 */
async function getCalendarEvents() {
  /** All the calendar events */
  let allData: calendar_v3.Schema$Event[] = [];
  /** The page token */
  let pageToken: string | undefined;
  /** The stored sync token */
  const kvSyncToken = await kv.get<string>("syncToken");

  /** The google calendar parameters */
  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId: env.VITE_GOOGLE_CALENDAR_ID,
    showDeleted: true,
    singleEvents: true,
    syncToken: kvSyncToken,
  };

  try {
    const initialData = await promiseifiedCalEventsList(params);

    if (initialData.items) {
      allData = allData.concat(initialData.items);
    }

    if (initialData.nextSyncToken) {
      kv.set("syncToken", initialData.nextSyncToken);
    }

    if (initialData.nextPageToken) {
      pageToken = initialData.nextPageToken;
    }
  } catch {
    // Throw an error if the sync token is not present
    // If the first request failed without a sync token
    // then it failed for another reason
    if (!kvSyncToken) {
      throw new Error("Failed to fetch initial data");
    }

    const initialData = await promiseifiedCalEventsList({
      ...params,
      syncToken: undefined,
    });

    if (initialData.items) {
      allData = allData.concat(initialData.items);
    }

    if (initialData.nextSyncToken) {
      kv.set("syncToken", initialData.nextSyncToken);
    }

    pageToken = initialData.nextPageToken ?? undefined;
  }

  while (pageToken) {
    const data = await promiseifiedCalEventsList({
      ...params,
      pageToken,
    });

    // If there are items, push them to the allData array
    if (data.items) {
      allData = allData.concat(data.items);
    }

    // If there is a next page token, update the page token
    // If there is no next page token, set the page token to undefined
    pageToken = data.nextPageToken ?? undefined;

    // If the sync token is present, update it
    if (data.nextSyncToken) {
      kv.set("syncToken", data.nextSyncToken);
    }
  }

  return allData;
}

/**
 * Gets the start and end dates of an event
 * @param event Google Calendar event
 * @returns Object with start and end dates
 */
const getEventDates = (event: calendar_v3.Schema$Event) => {
  if (event.start?.date && event.end?.date) {
    return {
      allDay: true,
      startDate: DateTime.fromISO(event.start.date).toJSDate(),
      endDate: DateTime.fromISO(event.end.date).toJSDate(),
    };
  }

  if (event.start?.dateTime && event.end?.dateTime) {
    return {
      allDay: false,
      startDate: DateTime.fromISO(event.start.dateTime).toJSDate(),
      endDate: DateTime.fromISO(event.end.dateTime).toJSDate(),
    };
  }

  throw new Error("Event start or end is null or incorrectly entered");
};

/**
 * Converts a Google Calendar event to an event object
 * @param gcalEvent Google Calendar event
 * @returns Event object
 */
const googleEventToEvent = (
  gcalEvent: calendar_v3.Schema$Event,
): EventInsert => {
  const { id } = gcalEvent;

  if (!id) {
    throw new Error("Event does not have an ID");
  }

  const { startDate, endDate, allDay } = getEventDates(gcalEvent);

  return {
    id,
    title: gcalEvent.summary ?? "",
    description: gcalEvent.description ?? "",
    startDate,
    endDate,
    type: "Regular",
    allDay,
    isSyncedEvent: true,
  };
};

/**
 * Columns that can be updated in the event table based on Google Calendar events
 */
const updatableColumns: ColumnNames<typeof eventTable>[] = [
  "title",
  "startDate",
  "endDate",
  "description",
  "allDay",
  "type",
  "isSyncedEvent",
  "ruleId",
];

/**
 * Columns to update on conflict in the event table, everything that could change in a Google Calendar event
 * This excludes any changes made locally
 */
const conflictUpdateColumns = buildConflictUpdateColumns(
  eventTable,
  updatableColumns,
);

/**
 * Columns to check for changes in the event table to determine if the event should be updated
 */
const conflictWhereColumns = buildSetWhereColumns(eventTable, updatableColumns);

/**
 * Checks if an event matches a rule
 * @param rule regex and id of the rule
 * @param e event to check (title and description)
 * @returns Whether the event matches the rule
 */
const isMatchingRule = (
  rule: { id: string; regex: string },
  e: { title: string; description?: string },
): boolean => {
  const regex = strToRegex(rule.regex);

  if (e.description) {
    return regex.test(e.title) || regex.test(e.description);
  }

  return regex.test(e.title);
};

/**
 * Syncs events from Google Calendar to the database
 */
export const syncEvents = async () => {
  eventLogger.time("Sync Events");

  /** All the calendar events */
  const calendarEvents = await getCalendarEvents();

  /** Filters to map events to */
  const filters = await db
    .select({
      id: eventParsingRuleTable.id,
      regex: eventParsingRuleTable.regex,
    })
    .from(eventParsingRuleTable)
    .orderBy(asc(eventParsingRuleTable.priority)); // Order by priority, lowest to highest (the lower the priority, the higher the precedence)

  /** Events to delete */
  const toDelete = calendarEvents
    .filter((e) => e.status === "cancelled" && !!e.id)
    .map((e) => e.id) as string[];

  /** Events to upsert */
  const toUpsert = calendarEvents
    .filter((e) => e.status !== "cancelled") // Filter out events that are marked as cancelled
    .map(googleEventToEvent) // Map Google Calendar events to event objects
    .map((e) => mapEventToRule(e, filters)); // Map events with rules

  /** The number of events that were deleted */
  let deletedCount = 0;

  // Delete events that are marked as cancelled
  if (toDelete.length) {
    const [deletedData, deleteError] = await trytm(
      db.delete(eventTable).where(inArray(eventTable.id, toDelete)).returning({
        id: eventTable.id,
      }),
    );

    if (deleteError) {
      eventLogger.error("Failed to delete events", deleteError);
    }

    deletedCount = deletedData?.length ?? 0;

    eventLogger.info(`Deleted ${deletedCount} events`);
  }

  /** Events to create or update */
  let upsertedCount = 0;

  // Upsert events that are not marked as cancelled
  if (toUpsert.length) {
    const [insertedData, insertError] = await trytm(
      db
        .insert(eventTable)
        .values(toUpsert)
        .onConflictDoUpdate({
          target: [eventTable.id],
          set: conflictUpdateColumns,
          setWhere: conflictWhereColumns,
        })
        .returning({
          id: eventTable.id,
        }),
    );

    if (insertError) {
      eventLogger.error("Failed to insert events", insertError);
    }

    upsertedCount = insertedData?.length ?? 0;

    eventLogger.info(`Upserted ${upsertedCount} events`);
  }

  eventLogger.timeEnd("Sync Events");

  return { updatedEvents: upsertedCount, deletedEventCount: deletedCount };
};

export const fullSyncEvents = async () => {
  await kv.delete("syncToken");
  return syncEvents();
};

/**
 * Maps an event to a rule
 * @param filters Filters to map to
 * @returns Function to map an event to a rule
 */
function mapEventToRule(
  e: EventInsert,
  filters: { id: string; regex: string }[],
): EventInsert {
  // Find the first matching rule
  const matchingRuleId = filters.find((r) => isMatchingRule(r, e))?.id;

  // If there is no matching rule, set the rule ID to null
  if (matchingRuleId) {
    return {
      ...e,
      ruleId: matchingRuleId,
    };
  }

  // If there is a matching rule, set the rule ID to the matching rule ID
  return {
    ...e,
    ruleId: null,
  };
}
