import { config } from "dotenv";
import { z } from "zod";

config();

const EnvSchema = z.object({
  /**
   * Database
   */
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  POSTGRES_DB: z.string().default("postgres"),
  POSTGRES_HOST: z.string().default("localhost"),
  DATABASE_URL: z
    .string()
    .url()
    .default("postgres://postgres:postgres@localhost:5432/postgres"),
  /**
   * Redis
   */
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  /**
   * Auth and cookies
   */
  TBA_TOKEN: z.string(),
  /**
   * Bot stuff
   */
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_CALLBACK_URL: z
    .string()
    .default("http://localhost:3000/api/auth/discord/callback"),
  DISCORD_DESKTOP_CALLBACK_URL: z
    .string()
    .default("http://localhost:3000/api/auth/discord-desktop/callback"),
  /**
   * Misc
   */
  GUILD_ID: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  SESSION_SECRET: z.string().default("secret"),
  JWT_SECRET: z.string().default("secret"),
  PORT: z.coerce.number().int().default(3000),
  /**
   * Calendar stuff
   */
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_PROJECT_NUMBER: z.string(),
  GOOGLE_CALENDAR_ID: z.string(),
  /**
   * API Token
   */
  BACKEND_SECRET_TOKEN: z.string().optional(),
  /**
   * Roles
   */
  MENTOR_ROLE_ID: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse(process.env ?? import.meta.env);

export const isDev = process.env.NODE_ENV === "development";

export const isProd = process.env.NODE_ENV === "production";

export default env;
