import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  isServer: import.meta.env.SSR,
  server: {
    /**
     * Database
     */
    DATABASE_URL: z
      .string()
      .url()
      .default("postgres://postgres:postgres@localhost:5432/postgres"),
    /**
     * Bot stuff
     */
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_PUBLIC_KEY: z.string(),
    DISCORD_CALLBACK_URL: z
      .string()
      .default("http://localhost:1420/api/auth/discord/callback"),
    DISCORD_TOKEN: z.string(),
    /**
     * Misc
     */
    GUILD_ID: z.string(),

    /**
     * Calendar stuff
     */
    GOOGLE_CLIENT_EMAIL: z.string(),
    GOOGLE_PRIVATE_KEY: z.string(),
    GOOGLE_CALENDAR_ID: z.string(),
    /**
     * Roles
     */
    MENTOR_ROLE_ID: z.string(),
    /**
     * Kronos cron job connection url
     */
    WEBHOOK_SERVER: z.string().optional(),
  },
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
    DISCORD_CALLBACK_URL: process.env.DISCORD_CALLBACK_URL,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
    MENTOR_ROLE_ID: process.env.MENTOR_ROLE_ID,
    WEBHOOK_SERVER: process.env.WEBHOOK_SERVER,
    VITE_FRONTEND_URL:
      process.env.VITE_FRONTEND_URL ?? import.meta.env.VITE_FRONTEND_URL,
    VITE_VERSION: import.meta.env.VITE_VERSION ?? process.env.VITE_VERSION,
  },
  clientPrefix: "VITE_",
  client: {
    VITE_FRONTEND_URL: z.string().default("http://localhost:1420"),
    VITE_VERSION: z.string().optional(),
  },
});

export default env;
