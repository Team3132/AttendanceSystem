import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    user: "postgres",
    database: "postgres",
    password: "postgres",
    connectionString: "postgres://postgres:postgres@localhost:5432/postgres",
  },
} satisfies Config;
