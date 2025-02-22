ALTER TABLE "RSVP" ADD COLUMN "arrivingAt" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "RSVP" ADD COLUMN "leavingAt" timestamp (3) with time zone;--> statement-breakpoint
UPDATE "RSVP" r SET "arrivingAt" = CASE WHEN r."delay" IS NOT NULL THEN e."startDate" + (r."delay" || ' minutes')::interval ELSE NULL END FROM "Event" e WHERE r."eventId" = e."id";--> statement-breakpoint
ALTER TABLE "RSVP" DROP COLUMN "delay";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "additionalOutreachHours";