ALTER TABLE "RSVP" ADD COLUMN "arrivingAt" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "RSVP" ADD COLUMN "leavingAt" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "RSVP" DROP COLUMN "delay";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "additionalOutreachHours";