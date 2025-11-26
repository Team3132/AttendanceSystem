import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateDB } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import env from "../env";
import { consola } from "../logger";
import * as schema from "./schema";

export async function migrate() {
  const logger = consola.withTag("db");

  const migrationPath = path.resolve("./drizzle");
  logger.info("Migration path:", migrationPath);

  const migrationPgClient = postgres(env.DATABASE_URL, {
    max: 1,
  });
  const migrationClient = drizzle(migrationPgClient, {
    schema,
    logger: {
      logQuery: (query, params) => {
        logger.debug(
          "Executing query in migration:",
          query,
          "with params:",
          params,
        );
      },
    },
  });
  logger.info("Starting database migrations...");
  await migrateDB(migrationClient, { migrationsFolder: migrationPath });
  logger.success("Database migrations completed successfully");
}

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

const db = drizzle(pgClient, {
  schema,
  logger: {
    logQuery: (query, params) => {
      consola.debug("Executing query:", query, "with params:", params);
    },
  },
});

export default db;
