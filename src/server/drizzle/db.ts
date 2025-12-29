import { mkdir } from "node:fs/promises";
import path from "node:path";
import { createServerOnlyFn } from "@tanstack/react-start";
import env from "../env";
import { consola } from "../logger";

export const getDB = createServerOnlyFn(async () => {
  const logger = consola.withTag("db");
  const schema = await import("./schema");
  const migrationPath = path.resolve("./drizzle");

  if (import.meta.env.MODE === "test") {
    logger.warn("DB Starting in test mode");
    const { drizzle } = await import("drizzle-orm/pglite");
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    const { PGlite } = await import("@electric-sql/pglite");

    const storageDir = path.resolve("./node_modules/.db/data");
    await mkdir(storageDir, {
      recursive: true,
    });

    const client = new PGlite(storageDir);

    const db = drizzle({
      schema,
      client,
    });

    await migrate(db, { migrationsFolder: migrationPath });

    logger.success("Database migrations completed successfully");

    return db;
  }

  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");

  const migrationPgClient = postgres(env.DATABASE_URL, {
    max: 1,
  });

  const migrationClient = drizzle(migrationPgClient, {
    schema,
  });

  await migrate(migrationClient, { migrationsFolder: migrationPath });

  logger.success("Database migrations completed successfully");

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
  });

  return db;
});
