import { Common, type calendar_v3, google } from "googleapis";

import { adminMiddleware } from "@/middleware/authMiddleware";
import { trytm } from "@/utils/trytm";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { asc, inArray } from "drizzle-orm";
import { DateTime } from "luxon";
import { kv } from "../drizzle/kv";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import { consola } from "../logger";
import type { ColumnNames } from "../utils/db/ColumnNames";
import { buildConflictUpdateColumns } from "../utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "../utils/db/buildSetWhereColumns";
import { strToRegex } from "../utils/regexBuilder";

const eventLogger = consola.withTag("eventSync");

type EventInsert = typeof eventTable.$inferInsert;

/**
 * Generator function to get all calendar events
 */
const incrementalSync = createServerOnlyFn(async function* (
  syncToken?: string,
) {
  const client = new google.auth.JWT({
    email: env.GOOGLE_CLIENT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  const calendar = google.calendar({
    version: "v3",
    auth: client,
  });

  /** The google calendar parameters */
  const params: calendar_v3.Params$Resource$Events$List = {
    calendarId: env.GOOGLE_CALENDAR_ID,
    showDeleted: true,
    singleEvents: true,
    syncToken,
  };

  const [responseData, error] = await trytm(calendar.events.list(params));

  if (error) {
    if (error instanceof Common.GaxiosError && error.status === 410) {
      // Sync token is invalid, need to do a full sync
      eventLogger.warn("Sync token is invalid, performing full sync");
      await kv.delete("syncToken");
      return incrementalSync();
    }

    throw error;
  }

  const initialData = responseData.data;

  if (initialData.items) {
    yield initialData.items;
  }

  if (initialData.nextSyncToken) {
    await kv.set("syncToken", initialData.nextSyncToken);
  }

  /** The page token */
  let pageToken: string | undefined;

  if (initialData.nextPageToken) {
    pageToken = initialData.nextPageToken;
  }

  while (pageToken) {
    const [response, error] = await trytm(
      calendar.events.list({
        ...params,
        pageToken,
      }),
    );

    if (error) {
      if (error instanceof Common.GaxiosError && error.status === 410) {
        // Sync token is invalid, need to do a full sync
        eventLogger.warn("Sync token is invalid, performing full sync");
        await kv.delete("syncToken");
        return incrementalSync();
      }

      throw error;
    }

    const data = response.data;

    // If there are items, push them to the allData array
    if (data.items) {
      yield data.items;
    }

    // If there is a next page token, update the page token
    // If there is no next page token, set the page token to undefined
    pageToken = data.nextPageToken ?? undefined;

    // If the sync token is present, update it
    if (data.nextSyncToken) {
      await kv.set("syncToken", data.nextSyncToken);
    }
  }
});

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
 * @todo maybe replace with serveronlyfn
 */
export const syncEvents = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    eventLogger.info("Sync Events");
    const syncToken = await kv.get<string>("syncToken");

    /** All the calendar events */
    const calendarEvents = await incrementalSync(syncToken);

    /** Filters to map events to */
    const filters = await db
      .select({
        id: eventParsingRuleTable.id,
        regex: eventParsingRuleTable.regex,
      })
      .from(eventParsingRuleTable)
      .orderBy(asc(eventParsingRuleTable.priority)); // Order by priority, lowest to highest (the lower the priority, the higher the precedence)

    let totalDeleted = 0;
    let totalUpserted = 0;

    for await (const events of calendarEvents) {
      const toDelete = events
        .filter((e) => e.status === "cancelled" && !!e.id)
        .map((e) => e.id) as string[];

      /** Events to upsert */
      const toUpsert = events
        .filter((e) => e.status !== "cancelled") // Filter out events that are marked as cancelled
        .map(googleEventToEvent) // Map Google Calendar events to event objects
        .map((e) => mapEventToRule(e, filters)); // Map events with rules

      if (toDelete.length) {
        const [deletedData, deleteError] = await trytm(
          db
            .delete(eventTable)
            .where(inArray(eventTable.id, toDelete))
            .returning({
              id: eventTable.id,
            }),
        );

        if (deleteError) {
          eventLogger.error("Failed to delete events", deleteError);
        }

        if (deletedData?.length) {
          totalDeleted += deletedData.length;
        }
      }

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

        if (insertedData?.length) {
          totalUpserted += insertedData.length;
        }
      }
    }

    eventLogger.info(`Deleted ${totalDeleted} events`);
    eventLogger.info(`Upserted ${totalUpserted} events`);

    eventLogger.success("Sync Events");

    return { updatedEvents: totalUpserted, deletedEventCount: totalDeleted };
  });

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
