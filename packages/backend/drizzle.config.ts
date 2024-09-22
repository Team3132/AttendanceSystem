import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: "localhost",
    user: "postgres",
    database: "postgres",
    password: "postgres",
  },
} satisfies Config;
