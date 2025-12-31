import { mkdir } from "node:fs/promises";
import path from "node:path";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import env from "../env";
import { consola } from "../logger";

/**
 * Instantiate a PostgreSQL or PGlite database connection using Drizzle ORM.
 *
 * In development mode, it uses PGlite for a lightweight local database.
 * In production, it connects to a PostgreSQL database using the provided
 * DATABASE_URL environment variable.
 *
 * The function also runs any pending database migrations on startup.
 *
 * @returns A Drizzle ORM database instance connected to the appropriate database.
 */
export const getDB = createServerOnlyFn(async (): Promise<DB> => {
  const logger = consola.withTag("db"); // Create a logger instance with "db" tag
  const schema = await import("./schema"); // Import the database schema
  const migrationPath = path.resolve("./drizzle"); // Path to migration files, SQL and metadata

  if (import.meta.env.DEV) {
    logger.warn("Using PGlite database in development mode");

    const { drizzle } = await import("drizzle-orm/pglite");
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    const { PGlite } = await import("@electric-sql/pglite");

    const databaseDir = path.resolve("./data"); // Directory for the pglite database files

    logger.info(`Ensuring database directory exists at ${databaseDir}`);

    // Ensure the database directory exists
    await mkdir(databaseDir, {
      recursive: true,
    });

    const client = new PGlite(databaseDir); // Create the pglite client

    // Create the drizzle instance
    const db = drizzle({
      schema,
      client,
    });

    await migrate(db, { migrationsFolder: migrationPath }); // Run migrations

    logger.success("Database migrations completed successfully");

    return db;
  }

  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");

  // Make a separate postgres client for migrations to avoid pooling migrations and breaking things
  const migrationClient = postgres(env.DATABASE_URL, {
    max: 1,
  });

  // Make the drizzle instance for migrations
  const migrationDrizzle = drizzle({
    schema,
    client: migrationClient,
  });

  await migrate(migrationDrizzle, { migrationsFolder: migrationPath }); // Finally run migrations

  await migrationClient.end(); // Close migration client

  logger.success("Database migrations completed successfully");

  const client = postgres(env.DATABASE_URL); // Make the main postgres client

  // Make the main drizzle instance
  const db = drizzle({
    schema,
    client,
  });

  return db;
});

export type DB =
  | PostgresJsDatabase<Awaited<typeof import("./schema")>>
  | PgliteDatabase<Awaited<typeof import("./schema")>>;
