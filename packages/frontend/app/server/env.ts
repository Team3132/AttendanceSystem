import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  isServer: import.meta.env.SSR,
  server: {
    /**
     * Database
     */
    VITE_POSTGRES_USER: z.string().default("postgres"),
    VITE_POSTGRES_PASSWORD: z.string().default("postgres"),
    VITE_POSTGRES_DB: z.string().default("postgres"),
    VITE_POSTGRES_HOST: z.string().default("localhost"),
    VITE_DATABASE_URL: z
      .string()
      .url()
      .default("postgres://postgres:postgres@localhost:5432/postgres"),
    /**
     * Auth and cookies
     */
    VITE_TBA_TOKEN: z.string(),
    /**
     * Bot stuff
     */
    VITE_DISCORD_CLIENT_ID: z.string(),
    VITE_DISCORD_CLIENT_SECRET: z.string(),
    VITE_DISCORD_CALLBACK_URL: z
      .string()
      .default("http://localhost:3000/api/auth/discord/callback"),
    VITE_DISCORD_DESKTOP_CALLBACK_URL: z
      .string()
      .default("http://localhost:3000/api/auth/discord-desktop/callback"),
    VITE_DISCORD_TOKEN: z.string(),
    /**
     * Misc
     */
    VITE_GUILD_ID: z.string(),
    VITE_FRONTEND_URL: z.string().default("http://localhost:3000"),
    VITE_SESSION_SECRET: z.string().default("secret"),
    VITE_JWT_SECRET: z.string().default("secret"),
    VITE_PORT: z.coerce.number().int().default(3000),
    /**
     * Calendar stuff
     */
    VITE_GOOGLE_CLIENT_EMAIL: z.string(),
    VITE_GOOGLE_PRIVATE_KEY: z.string(),
    VITE_GOOGLE_PROJECT_NUMBER: z.string(),
    VITE_GOOGLE_CALENDAR_ID: z.string(),
    /**
     * API Token
     */
    VITE_BACKEND_SECRET_TOKEN: z.string().optional(),
    /**
     * Roles
     */
    VITE_MENTOR_ROLE_ID: z.string(),
    /**
     * Kronos cron job connection url
     */
    VITE_KRONOS_URL: z.string().optional(),
  },
  runtimeEnv: {
    ...((import.meta as unknown as { env: Record<string, string> }).env ?? {}),
    ...(typeof process !== "undefined"
      ? (process.env as Record<string, string>)
      : {}),
  },
  clientPrefix: "VITE_PUBLIC",
  client: {
    VITE_PUBLIC_BACKEND_URL: z.string().default("http://localhost:3000/api"),
    VITE_PUBLIC_APP_VERSION: z.string().optional(),
  },
});

export default env;
