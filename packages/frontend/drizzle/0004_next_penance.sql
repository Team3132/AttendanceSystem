ALTER TABLE "RSVP" ADD COLUMN "checkinTime" timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "RSVP" ADD COLUMN "checkoutTime" timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "RSVP" DROP COLUMN IF EXISTS "attended";