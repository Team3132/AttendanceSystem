import path from "node:path";
import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateDB } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import env from "../env";
import { consola } from "../logger";

export const migrate = createServerOnlyFn(async () => {
  const logger = consola.withTag("db");

  const migrationPath = path.resolve("./drizzle");
  logger.info("Migration path:", migrationPath);

  const migrationPgClient = postgres(env.DATABASE_URL, {
    max: 1,
  });

  const schema = await import("./schema");

  const migrationClient = drizzle(migrationPgClient, {
    schema,
  });

  logger.info("Starting database migrations...");
  await migrateDB(migrationClient, { migrationsFolder: migrationPath });
  logger.success("Database migrations completed successfully");
});

export const getDB = createServerOnlyFn(async () => {
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

  const schema = await import("./schema");

  const db = drizzle(pgClient, {
    schema,
    logger: {
      logQuery: (query, params) => {
        consola.debug("Executing query:", query, "with params:", params);
      },
    },
  });

  return db;
});
