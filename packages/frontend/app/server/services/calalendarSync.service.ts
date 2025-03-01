import { type calendar_v3, google } from "googleapis";

import { trytm } from "@/utils/trytm";
import { type SQL, asc, getTableColumns, inArray, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { DateTime } from "luxon";
import db from "../drizzle/db";
import { kv } from "../drizzle/kv";
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
const googleEventToEvent = (gcalEvent: calendar_v3.Schema$Event) => {
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
  } satisfies EventInsert;
};

/**
 * Builds the columns to update in the event table on conflict
 * @param table Table to build the columns for
 * @param columns Columns to update
 * @returns Object with columns to update
 */
const buildConflictUpdateColumns = <
  T extends PgTable | SQLiteTable,
  Q extends keyof T["_"]["columns"],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);

  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);
      return acc;
    },
    {} as Record<Q, SQL>,
  );
};

/**
 * Syncs events from Google Calendar to the database
 */
export const syncEvents = async () => {
  eventLogger.time("Sync Events");

  const calendarEvents = await getCalendarEvents();

  const filters = await db
    .select({
      id: eventParsingRuleTable.id,
      regex: eventParsingRuleTable.regex,
    })
    .from(eventParsingRuleTable)
    .orderBy(asc(eventParsingRuleTable.priority));

  const toDelete = calendarEvents
    .filter((e) => e.status === "cancelled")
    .map((e) => e.id)
    .filter(Boolean) as string[];

  const toUpsert = calendarEvents
    .filter((e) => e.status !== "cancelled")
    .map(googleEventToEvent)
    .map((e) => {
      // Find the first matching rule
      const matchingRuleId = filters.find((rule) => {
        const regex = strToRegex(rule.regex);

        return regex.test(e.title) || regex.test(e.description);
      })?.id;

      // If there is no matching rule, set the rule ID to null
      if (!matchingRuleId) {
        return {
          ...e,
          ruleId: null,
        };
      }

      // If there is a matching rule, set the rule ID to the matching rule ID
      return {
        ...e,
        ruleId: matchingRuleId,
      };
    });

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
  }

  let upsertedCount = 0;

  // Upsert events that are not marked as cancelled
  if (toUpsert.length) {
    const [insertedData, insertError] = await trytm(
      db
        .insert(eventTable)
        .values(toUpsert)
        .onConflictDoUpdate({
          target: [eventTable.id],
          set: buildConflictUpdateColumns(eventTable, [
            "title",
            "startDate",
            "endDate",
            "description",
            "allDay",
            "type",
            "isSyncedEvent",
            "ruleId",
          ]),
        })
        .returning({
          id: eventTable.id,
        }),
    );

    if (insertError) {
      eventLogger.error("Failed to insert events", insertError);
    }

    upsertedCount = insertedData?.length ?? 0;
  }

  eventLogger.timeEnd("Sync Events");
  eventLogger.info(`Deleted ${deletedCount} events`);
  eventLogger.info(`Upserted ${upsertedCount} events`);

  return { updatedEvents: upsertedCount, deletedEventCount: deletedCount };
};

export const fullSyncEvents = async () => {
  await kv.delete("syncToken");
  return syncEvents();
};
