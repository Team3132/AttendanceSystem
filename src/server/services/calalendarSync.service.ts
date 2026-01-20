import type { ServerContext } from "@/server";
import { logger } from "@/utils/logger";
import { trytm } from "@/utils/trytm";
import { createServerOnlyFn } from "@tanstack/react-start";
import { asc, inArray } from "drizzle-orm";
import { Common, type calendar_v3, google } from "googleapis";
import { DateTime } from "luxon";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import type { ColumnNames } from "../utils/db/ColumnNames";
import { buildConflictUpdateColumns } from "../utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "../utils/db/buildSetWhereColumns";
import { strToRegex } from "../utils/regexBuilder";

type EventInsert = typeof eventTable.$inferInsert;

/**
 * Generator function to get all calendar events
 */
const incrementalSync = createServerOnlyFn(async function* (
  c: ServerContext,
  syncToken?: string,
) {
  if (
    !env.GOOGLE_CALENDAR_ID ||
    !env.GOOGLE_PRIVATE_KEY ||
    !env.GOOGLE_CLIENT_EMAIL
  ) {
    throw new Error("Calendar sync not configured!");
  }

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

  const { kv } = c;

  if (error) {
    if (error instanceof Common.GaxiosError && error.status === 410) {
      // Sync token is invalid, need to do a full sync
      syncLogger.warn("Sync token is invalid, performing full sync");
      await kv.delete("syncToken");
      return incrementalSync(c);
    }

    throw error;
  }

  const initialData = responseData.data;

  if (initialData.items) {
    yield initialData.items;
  }

  if (initialData.nextSyncToken) {
    await kv.set("syncToken", initialData.nextSyncToken);
    syncLogger.debug("Updated sync token", initialData.nextSyncToken);
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
        syncLogger.warn("Sync token is invalid, performing full sync");
        await kv.delete("syncToken");
        return incrementalSync(c);
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
      syncLogger.debug("Updated sync token", data.nextSyncToken);
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

const syncLogger = logger.withTag("CalendarSync");

/**
 * Syncs events from Google Calendar to the database
 * @todo maybe replace with serveronlyfn
 */
export const syncEvents = createServerOnlyFn(async (c: ServerContext) => {
  const { kv, db } = c;
  const start = performance.now();

  syncLogger.start("Sync Events");
  const syncToken = await kv.get<string>("syncToken");
  syncLogger.debug("Using sync token", syncToken);

  /** All the calendar events */
  const calendarEvents = incrementalSync(c, syncToken);

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
          .returning(),
      );

      if (deleteError) {
        syncLogger.error("Failed to delete events", deleteError);
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
          .returning(),
      );

      if (insertError) {
        syncLogger.error("Failed to insert events", insertError);
      }

      if (insertedData?.length) {
        totalUpserted += insertedData.length;
      }
    }
  }

  if (totalDeleted) syncLogger.info(`Deleted ${totalDeleted} events`);
  if (totalUpserted) syncLogger.info(`Upserted ${totalUpserted} events`);

  syncLogger.success(
    `Sync Events (${Math.round(performance.now() - start)}ms)`,
  );

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
