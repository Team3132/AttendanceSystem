import { createPubSub } from "@graphql-yoga/subscription";
import { type Register, createServerOnlyFn } from "@tanstack/react-start";
import type { RequestOptions } from "@tanstack/react-start/server";
import handler from "@tanstack/react-start/server-entry";
import type { Server } from "bun";
import { Cron, scheduledJobs } from "croner";
import { DateTime } from "luxon";
import type z from "zod";
import { type DB, initialiseDatabase } from "./server/drizzle/db";
import { getKV } from "./server/drizzle/kv";
import env from "./server/env";
import type { RSVPStatusSchema } from "./server/schema";
import { reminderFn } from "./server/services/adminService";

/**
 * A pubsub events manager for future websocket features
 */
const pubSub = createPubSub<{
  "event:rsvpUpdated": [
    eventId: string,
    payload: {
      userId: string;
      rsvpId: string;
      status?: z.infer<typeof RSVPStatusSchema> | null;
    },
  ];
}>();

const db = await initialiseDatabase();

const kv = getKV(db);

/**
 * Restore CRON Jobs
 */
async function restoreCron() {
  const filters = await db.query.eventParsingRuleTable.findMany();

  for (const filter of filters) {
    const existingJobs = scheduledJobs.filter((job) => job.name === filter.id);

    for (const job of existingJobs) {
      console.log(`Job: ${job.name} deleted`);
      job.stop();
    }

    const job = new Cron(
      filter.cronExpr,
      {
        name: filter.id,
      },
      reminderFn,
    );

    const nextRun = job.nextRun();

    console.log(
      `Job: ${job.name} (${filter.name}) created, next run: ${nextRun ? DateTime.fromJSDate(nextRun).toLocaleString(DateTime.DATETIME_MED) : "unknown"}`,
    );
  }
}

if (!env.TSS_PRERENDERING) await restoreCron();

type MyRequestContext = {
  server: Server<undefined>;
  pubSub: typeof pubSub;
  db: DB;
  kv: ReturnType<typeof getKV>;
};

// This needs to be tanstack router, currently incorrect
declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: MyRequestContext;
    };
  }
}

const serverHandler = createServerOnlyFn(handler.fetch);

export default {
  fetch(
    req: Request,
    opts: RequestOptions<Register>,
  ): Response | Promise<Response> {
    const context = {
      ...opts?.context,
      pubSub,
      db,
      kv,
    } satisfies MyRequestContext;

    return serverHandler(req, { context });
  },
};
