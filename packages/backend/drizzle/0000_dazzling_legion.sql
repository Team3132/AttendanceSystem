-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

DO $$ BEGIN
 CREATE TYPE "EventTypes" AS ENUM('Social', 'Regular', 'Outreach');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "RSVPStatus" AS ENUM('LATE', 'MAYBE', 'NO', 'YES');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"username" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"calendarSecret" text NOT NULL,
	"roles" text[],
	"defaultStatus" "RSVPStatus"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RSVP" (
	"id" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" "RSVPStatus",
	"attended" boolean DEFAULT false NOT NULL,
	"delay" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"startDate" timestamp(3) NOT NULL,
	"endDate" timestamp(3) NOT NULL,
	"allDay" boolean DEFAULT false NOT NULL,
	"type" "EventTypes" DEFAULT 'Regular' NOT NULL,
	"secret" text NOT NULL,
	"roles" text[],
	"isSyncedEvent" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Scancode" (
	"code" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_calendarSecret_key" ON "User" ("calendarSecret");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "RSVP_eventId_userId_key" ON "RSVP" ("eventId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Event_secret_key" ON "Event" ("secret");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Scancode" ADD CONSTRAINT "Scancode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;