DROP INDEX "RSVP_eventId_userId_key";--> statement-breakpoint
ALTER TABLE "rsvp" ADD CONSTRAINT "RSVP_eventId_userId_key" PRIMARY KEY("event_id","user_id");--> statement-breakpoint
ALTER TABLE "rsvp" DROP COLUMN "id";