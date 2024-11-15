ALTER TYPE "public"."RSVPStatus" ADD VALUE 'ATTENDED';--> statement-breakpoint
ALTER TABLE "RSVP" DROP COLUMN IF EXISTS "checkedOut";