import type { QueryKeyValues } from "@/types/QueryKeyUtils";
import type { z } from "zod";
import type {
  GetEventParamsSchema,
  OutreachTimeSchema,
  UserListParamsSchema,
} from "./schema";

type UserListParams = Omit<z.infer<typeof UserListParamsSchema>, "cursor">;

/**
 * Get the resulting type of a function
 */
// biome-ignore lint/suspicious/noExplicitAny: Required for the Flatten type, unused in resulting code
export type Flatten<T> = T extends (...args: any[]) => infer R ? R : T;

export const usersQueryKeys = {
  users: ["users"] as const, // Root key for all user-related queries
  usersList: ["users", "list"] as const, // Key for the list of users
  usersListParams: (params: UserListParams) =>
    [...usersQueryKeys.usersList, params] as const, // Key for the list of users with specific parameters
  /** The details of the user */
  user: (id: string) => [...usersQueryKeys.users, "user", id] as const, // Root key for a specific user
  userDetails: (id: string) => [...usersQueryKeys.user(id), "details"] as const, // Key for the details of a specific user
  userScancodes: (id: string) =>
    [...usersQueryKeys.user(id), "scancodes"] as const, // Key for the scancodes of a specific user
  userPendingRsvps: (id: string) =>
    [...usersQueryKeys.user(id), "pendingRsvps"] as const, // Key for the pending rsvps of a specific user
  userSelf: () => [...usersQueryKeys.users, "self"] as const, // Root key for the current user
  userSelfDetails: () => [...usersQueryKeys.userSelf(), "details"] as const, // Key for the details of the current user
  userSelfScancodes: () => [...usersQueryKeys.userSelf(), "scancodes"] as const, // Key for the scancodes of the current user
  userSelfPendingRsvps: () =>
    [...usersQueryKeys.userSelf(), "pendingRsvps"] as const, // Key for the pending rsvps of the current user
};

type OutreachTimeOptions = Omit<z.infer<typeof OutreachTimeSchema>, "cursor">;

export const outreachQueryKeys = {
  leaderboard: (options: OutreachTimeOptions) =>
    ["leaderboard", options] as const,
};

type GetEventsParams = Omit<z.infer<typeof GetEventParamsSchema>, "cursor">;

export const eventQueryKeys = {
  events: ["events"] as const,
  eventsList: ["events", "list"] as const,
  /** The events list */
  eventsListParams: (options: GetEventsParams) =>
    [...eventQueryKeys.eventsList, options] as const,
  /** The referenced event descriminator */
  event: (id: string) => [...eventQueryKeys.events, id] as const,
  /** The details of the event */
  eventDetails: (id: string) =>
    [...eventQueryKeys.event(id), "details"] as const,
  eventSecret: (id: string) => [...eventQueryKeys.event(id), "secret"] as const,
  /* The logged in user's rsvp status **/
  eventRsvp: (id: string) => [...eventQueryKeys.event(id), "rsvp"] as const,
  /** The RSVPs for everyone for a specific event */
  eventUserRsvp: (eventId: string, userId: string) =>
    [...eventQueryKeys.eventRsvp(eventId), "details", userId] as const,

  eventRsvps: (id: string) =>
    [...eventQueryKeys.eventRsvp(id), "list"] as const,
};

export const authQueryKeys = {
  auth: ["auth"] as const,
  status: () => [...authQueryKeys.auth, "status"] as const,
};

export const adminQueryKeys = {
  admin: ["admin"] as const,
  apiKeys: ["admin", "apiKeys"] as const,
  parsingRules: ["admin", "parsingRules"] as const,
  parsingRuleList: () => [...adminQueryKeys.parsingRules, "list"] as const,
  parsingRule: (id: string) => [...adminQueryKeys.parsingRules, id] as const,
  parsingRuleDetails: (id: string) =>
    [...adminQueryKeys.parsingRule(id), "detail"] as const,
};

export const discordQueryKeys = {
  discord: ["discord"] as const,
  serverRoles: ["discord", "serverRoles"] as const,
  serverChannels: ["discord", "serverChannels"] as const,
};

export type StrictlyTypedQueryKeys =
  | QueryKeyValues<typeof usersQueryKeys>
  | QueryKeyValues<typeof outreachQueryKeys>
  | QueryKeyValues<typeof eventQueryKeys>
  | QueryKeyValues<typeof authQueryKeys>
  | QueryKeyValues<typeof adminQueryKeys>
  | QueryKeyValues<typeof discordQueryKeys>;
