import { createPubSub } from "@graphql-yoga/subscription";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import type { Register } from "@tanstack/react-start";
import type { RequestOptions } from "@tanstack/react-start/server";
import handler from "@tanstack/react-start/server-entry";
import type { Server } from "bun";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { BunWebSocketData } from "hono/bun";
import { Lucia, type RegisteredLucia } from "lucia";
import type z from "zod";
import { getDB, migrate } from "./server/drizzle/db";
import * as schema from "./server/drizzle/schema";
import type { RSVPStatusSchema } from "./server/schema";

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

type MyRequestContext = {
  server: Server<BunWebSocketData>;
  pubSub: typeof pubSub;
  db: PostgresJsDatabase<typeof schema>;
  lucia: RegisteredLucia;
};

// This needs to be tanstack router, currently incorrect
declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: MyRequestContext;
    };
  }
}

await migrate();

const db = await getDB();

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessionTable,
  schema.userTable,
); // your adapter

type DatabaseUser = typeof schema.userTable.$inferSelect;

const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "l-session",
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => ({
    username: attributes.username,
    createdAt: attributes.createdAt,
    updatedAt: attributes.updatedAt,
    roles: attributes.roles,
    defaultStatus: attributes.defaultStatus,
  }),
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}

export default {
  fetch(
    req: Request,
    opts: RequestOptions<Register>,
  ): Response | Promise<Response> {
    const context = { ...opts?.context, pubSub, db, lucia };

    return handler.fetch(req, { context });
  },
};
