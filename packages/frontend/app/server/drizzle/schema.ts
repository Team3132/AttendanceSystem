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
import { v4 } from "uuid";
import { ulid } from "ulidx";

export const eventTypes = pgEnum("EventTypes", [
	"Social",
	"Regular",
	"Outreach",
	"Mentor",
]);
export const rsvpStatus = pgEnum("RSVPStatus", [
	"LATE",
	"MAYBE",
	"NO",
	"YES",
	"ATTENDED",
]);

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
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
		precision: 3,
		mode: "date",
		withTimezone: true,
	}),
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
	apiKeys: many(apiKeyTable),
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

// API Key
export const apiKeyTable = pgTable("ApiKey", {
	id: text("id")
		.primaryKey()
		.notNull()
		.$default(() => ulid()),
	createdBy: text("createdBy").references(() => userTable.id),
	createdAt: timestamp("createdAt", {
		precision: 3,
		mode: "date",
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", {
		precision: 3,
		mode: "date",
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
});

export const apiKeyTableRelations = relations(apiKeyTable, ({ one }) => ({
	createdBy: one(userTable, {
		fields: [apiKeyTable.createdBy],
		references: [userTable.id],
	}),
}));

/** Parsing rules for event names */
export const eventParsingRuleTable = pgTable("EventParsingRule", {
	/** The Id of the rule */
	id: text("id")
		.primaryKey()
		.notNull()
		.$default(() => ulid()),
	/** The date the rule was created */
	createdAt: timestamp("createdAt", {
		precision: 3,
		mode: "date",
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
	/** The last time the rule was updated */
	updatedAt: timestamp("updatedAt", {
		precision: 3,
		mode: "date",
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
	/** The name of the rule */
	name: text("name").unique().notNull(),
	/** The title to match */
	regex: text("regex").notNull().default(""),
	/** The roles to ping */
	rolesIds: text("roles").array().notNull().default([]),
	/** The channel Id to make the announcement in */
	channelId: text("channelId").notNull(),
	/** Cron schedule */
	schedule: text("schedule").notNull().default(""),
});
