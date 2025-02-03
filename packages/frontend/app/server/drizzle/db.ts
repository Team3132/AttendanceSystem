import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateDB } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import env from "../env";
import mainLogger from "../logger";
import * as schema from "./schema";

const connectionUrl = `postgres://${env.VITE_POSTGRES_USER}:${env.VITE_POSTGRES_PASSWORD}@${env.VITE_POSTGRES_HOST}:5432/${env.VITE_POSTGRES_DB}`;

async function migrate() {
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

console.log("SSR Mode", import.meta.env.SSR);

await migrate();

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

const db = drizzle(pgClient, { schema });

export default db;
