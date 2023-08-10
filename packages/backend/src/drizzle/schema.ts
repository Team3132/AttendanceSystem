import { relations } from 'drizzle-orm';
import {
  pgTable,
  pgEnum,
  timestamp,
  text,
  integer,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';

export const eventTypes = pgEnum('EventTypes', [
  'Social',
  'Regular',
  'Outreach',
  'Mentor',
]);
export const rsvpStatus = pgEnum('RSVPStatus', ['LATE', 'MAYBE', 'NO', 'YES']);

export const user = pgTable('User', {
  username: text('username').notNull(),
  createdAt: timestamp('createdAt', {
    precision: 3,
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    precision: 3,
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  id: text('id').primaryKey().notNull(),
  roles: text('roles').array(),
  defaultStatus: rsvpStatus('defaultStatus'),
});

export const userRelations = relations(user, ({ many }) => ({
  rsvps: many(rsvp),
  scancodes: many(scancode),
}));

export const rsvp = pgTable(
  'RSVP',
  {
    id: text('id').primaryKey().notNull(),
    eventId: text('eventId')
      .notNull()
      .references(() => event.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    delay: integer('delay'),
    createdAt: timestamp('createdAt', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    status: rsvpStatus('status'),
    /**
     * The time that the user checks into the event
     */
    checkinTime: timestamp('checkinTime', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    }),
    /**
     * The time that the user checks out of the event
     */
    checkoutTime: timestamp('checkoutTime', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    }),
  },
  (table) => {
    return {
      eventIdUserIdKey: uniqueIndex('RSVP_eventId_userId_key').on(
        table.eventId,
        table.userId,
      ),
    };
  },
);

export const rsvpRelations = relations(rsvp, ({ one }) => ({
  user: one(user, { fields: [rsvp.userId], references: [user.id] }),
  event: one(event, { fields: [rsvp.eventId], references: [event.id] }),
}));

export const event = pgTable(
  'Event',
  {
    id: text('id').primaryKey().notNull(),
    description: text('description').default('').notNull(),
    title: text('title').notNull(),
    startDate: timestamp('startDate', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    }).notNull(),
    endDate: timestamp('endDate', {
      precision: 3,
      mode: 'string',
      withTimezone: true,
    }).notNull(),
    allDay: boolean('allDay').default(false).notNull(),
    type: eventTypes('type').default('Regular').notNull(),
    secret: text('secret').notNull(),
    isSyncedEvent: boolean('isSyncedEvent').default(false).notNull(),
  },
  (table) => {
    return {
      secretKey: uniqueIndex('Event_secret_key').on(table.secret),
    };
  },
);

export const eventRelations = relations(event, ({ many }) => ({
  rsvps: many(rsvp),
}));

export const scancode = pgTable('Scancode', {
  code: text('code').primaryKey().notNull(),
  createdAt: timestamp('createdAt', {
    precision: 3,
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    precision: 3,
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
});

export const scancodeRelations = relations(scancode, ({ one }) => ({
  user: one(user, { fields: [scancode.userId], references: [user.id] }),
}));
