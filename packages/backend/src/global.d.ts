import type { user } from "./drizzle/schema";

type UserSelect = typeof user.$inferSelect;

declare module "fastify" {
  interface PassportUser extends UserSelect {}
}
