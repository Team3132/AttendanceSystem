import type { Config } from "drizzle-kit";
import env from "./app/server/env.ts";

export default {
  dialect: "postgresql",
  schema: "./app/server/drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: env.VITE_POSTGRES_HOST,
    user: env.VITE_POSTGRES_USER,
    database: env.VITE_POSTGRES_DB,
    password: env.VITE_POSTGRES_PASSWORD,
  },
} satisfies Config;
