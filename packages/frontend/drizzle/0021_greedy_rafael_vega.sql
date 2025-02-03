DROP INDEX "Event_secret_key";--> statement-breakpoint
ALTER TABLE "EventParsingRule" ALTER COLUMN "kronosId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_secret_key" UNIQUE("secret");