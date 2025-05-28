DROP TABLE "BuildPoints" CASCADE;--> statement-breakpoint
ALTER TABLE "RSVP" ADD COLUMN "checkedOut" boolean DEFAULT false NOT NULL;