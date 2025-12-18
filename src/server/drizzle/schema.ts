import { randomUUID } from "node:crypto";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import randomStr from "../utils/randomStr";

export const rsvpStatus = pgEnum("rsvp_status", [
  "LATE",
  "MAYBE",
  "NO",
  "YES",
  "ATTENDED",
]);

export const userTable = pgTable("user", {
  username: text("username").notNull(),
  createdAt: timestamp("created_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  })
    .$onUpdateFn(() => new Date())
    .defaultNow()
    .notNull(),
  id: text("id").primaryKey().notNull(),
  roles: text("roles").array(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  }),
  defaultStatus: rsvpStatus("default_status"),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userTableRelations = relations(userTable, ({ many }) => ({
  rsvps: many(rsvpTable),
  scancodes: many(scancodeTable),
  apiKeys: many(apiKeyTable),
}));

export const rsvpTable = pgTable(
  "rsvp",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$default(() => randomUUID()),
    eventId: text("event_id")
      .notNull()
      .references(() => eventTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    arrivingAt: timestamp("arriving_at", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    }),
    leavingAt: timestamp("leaving_at", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
    status: rsvpStatus("status"),
    /**
     * The time that the user checks into the event
     */
    checkinTime: timestamp("checkin_time", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    }),
    /**
     * The time that the user checks out of the event
     */
    checkoutTime: timestamp("checkout_time", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    }),
  },
  (table) => {
    return {
      eventIdUserIdKey: uniqueIndex("RSVP_eventId_userId_key").on(
        table.eventId,
        table.userId,
      ),
    };
  },
);

export const rsvpTableRelations = relations(rsvpTable, ({ one }) => ({
  user: one(userTable, {
    fields: [rsvpTable.userId],
    references: [userTable.id],
  }),
  event: one(eventTable, {
    fields: [rsvpTable.eventId],
    references: [eventTable.id],
  }),
}));

export const eventTable = pgTable(
  "event",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    description: text("description").default("").notNull(),
    title: text("title").notNull(),
    startDate: timestamp("start_date", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    }).notNull(),
    endDate: timestamp("end_date", {
      precision: 3,
      mode: "date",
      withTimezone: true,
    }).notNull(),
    allDay: boolean("all_day").default(false).notNull(),
    secret: text("secret")
      .notNull()
      .$defaultFn(() => randomStr(8)),
    isSyncedEvent: boolean("is_synced_event").default(false).notNull(),
    isPosted: boolean("is_posted").default(false).notNull(),
    ruleId: text("rule_id").references(() => eventParsingRuleTable.id, {
      onDelete: "set null",
    }),
  },
  (table) => [unique("Event_secret_key").on(table.secret)],
);

export const eventTableRelations = relations(eventTable, ({ many, one }) => ({
  rsvps: many(rsvpTable),
  rule: one(eventParsingRuleTable, {
    relationName: "ruleOnEvent",
    fields: [eventTable.ruleId],
    references: [eventParsingRuleTable.id],
  }),
}));

export const scancodeTable = pgTable("scancode", {
  code: text("code").primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const scancodeTableRelations = relations(scancodeTable, ({ one }) => ({
  user: one(userTable, {
    fields: [scancodeTable.userId],
    references: [userTable.id],
  }),
}));

// API Key
export const apiKeyTable = pgTable("api_key", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => ulid()),
  name: text("name").notNull(),
  createdBy: text("created_by").references(() => userTable.id),
  createdAt: timestamp("created_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const apiKeyTableRelations = relations(apiKeyTable, ({ one }) => ({
  createdBy: one(userTable, {
    fields: [apiKeyTable.createdBy],
    references: [userTable.id],
  }),
}));

/** Parsing rules for event names */
export const eventParsingRuleTable = pgTable("parsing_rule", {
  /** The Id of the rule */
  id: text("id").primaryKey().notNull(),
  /** Cron Job Id */
  cronId: text("cron_id").notNull(),
  /** The title to match */
  regex: text("regex").notNull().default(""),
  /** Channel Id */
  channelId: text("channel_id").notNull(),
  /** Role Ids */
  roleIds: text("role_ids").array().notNull(),
  /** Priority */
  priority: integer("priority").notNull().default(0),
  /** Counts for outreach */
  isOutreach: boolean("is_outreach").notNull().default(false),
  /** The name of the rule */
  name: text("name").notNull(),
  /** The Cron Expression */
  cronExpr: text("cron_expr").notNull(),
});

export const eventParsingRuleTableRelations = relations(
  eventParsingRuleTable,
  ({ many }) => ({
    events: many(eventTable, {
      relationName: "ruleOnEvent",
    }),
  }),
);
