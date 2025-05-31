import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateDB } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import env from "../env";
import { consola } from "../logger";
import * as schema from "./schema";

async function migrate() {
  const logger = consola.withTag("db");

  const migrationPgClient = postgres(env.DATABASE_URL, {
    max: 1,
  });
  const migrationClient = drizzle(migrationPgClient, {
    schema,
  });
  logger.info("Starting database migrations...");
  await migrateDB(migrationClient, { migrationsFolder: "./drizzle" });
  logger.success("Database migrations completed successfully");
}

migrate();

const pgClient = postgres(env.DATABASE_URL, {
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
