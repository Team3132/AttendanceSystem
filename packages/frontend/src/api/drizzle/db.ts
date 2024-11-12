import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateDB } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import env from "../env";
import mainLogger from "../logger";
import * as schema from "./schema";

const connectionUrl = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:5432/${env.POSTGRES_DB}`;

export async function migrate() {
  const logger = mainLogger.child("DB");

  const migrationPgClient = postgres(connectionUrl, {
    max: 1,
  });
  const migrationClient = drizzle(migrationPgClient, {
    schema,
  });
  logger.time("Migrating database...");
  await migrateDB(migrationClient, { migrationsFolder: "./drizzle" });
  logger.timeEnd("Migrating database...");
}

const pgClient = postgres(connectionUrl, {
  transform: {
    value(value) {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    },
  },
});

export const db = drizzle(pgClient, { schema });

export default db;
