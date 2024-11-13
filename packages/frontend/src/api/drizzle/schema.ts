import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { v4 } from "uuid";

export const eventTypes = pgEnum("EventTypes", [
  "Social",
  "Regular",
  "Outreach",
  "Mentor",
]);
export const rsvpStatus = pgEnum("RSVPStatus", ["LATE", "MAYBE", "NO", "YES"]);

export const userTable = pgTable("User", {
  username: text("username").notNull(),
  createdAt: timestamp("createdAt", {
    precision: 3,
    mode: "string",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    precision: 3,
    mode: "string",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  id: text("id").primaryKey().notNull(),
  roles: text("roles").array(),
  defaultStatus: rsvpStatus("defaultStatus"),
  additionalOutreachHours: integer("additionalOutreachHours")
    .default(0)
    .notNull(),
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
}));

export const rsvpTable = pgTable(
  "RSVP",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$default(() => v4()),
    eventId: text("eventId")
      .notNull()
      .references(() => eventTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    delay: integer("delay"),
    createdAt: timestamp("createdAt", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    status: rsvpStatus("status"),
    /**
     * The time that the user checks into the event
     */
    checkinTime: timestamp("checkinTime", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    }),
    /**
     * The time that the user checks out of the event
     */
    checkoutTime: timestamp("checkoutTime", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    }),
    /** If a user has checked out of the event */
    checkedOut: boolean("checkedOut").default(false).notNull(),
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
  "Event",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => v4()),
    description: text("description").default("").notNull(),
    title: text("title").notNull(),
    startDate: timestamp("startDate", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    }).notNull(),
    endDate: timestamp("endDate", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    }).notNull(),
    allDay: boolean("allDay").default(false).notNull(),
    type: eventTypes("type").default("Regular").notNull(),
    secret: text("secret").notNull(),
    isSyncedEvent: boolean("isSyncedEvent").default(false).notNull(),
    isPosted: boolean("isPosted").default(false).notNull(),
  },
  (table) => {
    return {
      secretKey: uniqueIndex("Event_secret_key").on(table.secret),
    };
  },
);

export const eventTableRelations = relations(eventTable, ({ many }) => ({
  rsvps: many(rsvpTable),
}));

export const scancodeTable = pgTable("Scancode", {
  code: text("code").primaryKey().notNull(),
  createdAt: timestamp("createdAt", {
    precision: 3,
    mode: "string",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    precision: 3,
    mode: "string",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  userId: text("userId")
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
