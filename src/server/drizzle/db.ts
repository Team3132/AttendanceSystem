import path from "node:path";
import { logger } from "@/utils/logger";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { BunSQLDatabase } from "drizzle-orm/bun-sql";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import env from "../env";

const dbLogger = logger.withTag("Database");

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
export const initialiseDatabase = createServerOnlyFn(async (): Promise<DB> => {
  const databaseUrl = new URL(env.DATABASE_URL);
  const { protocol } = databaseUrl;
  const connectionString = databaseUrl.toString();

  const isPGLite = protocol === "file:" || protocol === "memory:";

  if (isPGLite) {
    const humanProtocol = protocol.slice(0, -1);

    dbLogger.info(`Using PGLITE ${humanProtocol} database`);

    return initPGLiteDatabase(connectionString);
  }

  if (typeof Bun !== "undefined") {
    dbLogger.info("Using Bun Postgres database");

    return initBunDatabase(connectionString);
  }

  dbLogger.info("Using PostgresJS database");

  return initPostgresDatabase(connectionString);
});

/**
 * Initialise the Postgres Drizzle ORM
 *
 * Performs the required migrations and then returns the Drizzle ORM
 * instance.
 *
 * @returns Drizzle ORM instance backed by PostgresJS
 */
async function initPostgresDatabase(databaseUrl: string) {
  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");
  const schema = await import("./schema"); // Import the database schema
  const migrationsFolder = path.resolve("./drizzle"); // Path to migration files, SQL and metadata

  /** The PostgresJS client used for migrations */
  const migrationClient = postgres(env.DATABASE_URL, {
    max: 1,
  });

  /** The Postgres Migration Client backed Drizzle client  */
  const migrationDrizzle = drizzle({
    schema,
    client: migrationClient,
  });

  await migrate(migrationDrizzle, { migrationsFolder }); // Finally run migrations

  await migrationClient.end(); // Close migration client

  dbLogger.success("Database migrations completed successfully");

  /** The PostgresJS client used for the database. */
  const client = postgres(databaseUrl);

  /** The Postgres backed Drizzle client */
  const db = drizzle({
    schema,
    client,
  });

  return db;
}

async function initBunDatabase(databaseUrl: string) {
  const { drizzle } = await import("drizzle-orm/bun-sql");
  const { migrate } = await import("drizzle-orm/bun-sql/migrator");
  const schema = await import("./schema"); // Import the database schema
  const migrationsFolder = path.resolve("./drizzle"); // Path to migration files, SQL and metadata

  const migrationClient = new Bun.SQL({
    url: databaseUrl,
    max: 1,
  });

  /** The Postgres Migration Client backed Drizzle client  */
  const migrationDrizzle = drizzle({
    schema,
    client: migrationClient,
  });

  await migrate(migrationDrizzle, { migrationsFolder }); // Finally run migrations

  await migrationClient.end(); // Close migration client

  dbLogger.success("Database migrations completed successfully");

  const client = new Bun.SQL({
    url: databaseUrl,
  });

  /** The Postgres backed Drizzle client */
  const db = drizzle({
    schema,
    client,
  });

  return db;
}

/**
 * Initialise the PGLite Drizzle ORM
 *
 * Performs the required migrations and then returns the Drizzle ORM
 * instance.
 *
 * @returns Drizzle ORM instance backed by PGLite
 */
async function initPGLiteDatabase(databaseUrl: string) {
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const { PGlite } = await import("@electric-sql/pglite");
  const schema = await import("./schema"); // Import the database schema
  const migrationsFolder = path.resolve("./drizzle"); // Path to migration files, SQL and metadata

  /** The PGLite client instance */
  const client = new PGlite(databaseUrl); // Create the pglite client

  /** The PGLite backed drizzle instance */
  const db = drizzle({
    schema,
    client,
  });

  await migrate(db, { migrationsFolder }); // Run migrations

  dbLogger.success("Database migrations completed successfully");

  return db;
}

export type DB =
  | PostgresJsDatabase<Awaited<typeof import("./schema")>>
  | PgliteDatabase<Awaited<typeof import("./schema")>>
  | BunSQLDatabase<Awaited<typeof import("./schema")>>;
