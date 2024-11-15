ALTER TABLE "RSVP" DROP CONSTRAINT "RSVP_userId_fkey";
--> statement-breakpoint
ALTER TABLE "RSVP" DROP CONSTRAINT "RSVP_eventId_fkey";
--> statement-breakpoint
ALTER TABLE "Scancode" DROP CONSTRAINT "Scancode_userId_fkey";
--> statement-breakpoint
DROP TABLE IF EXISTS "_prisma_migrations" ;--> statement-breakpoint
DROP INDEX IF EXISTS "User_calendarSecret_key";--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "RSVP" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "RSVP" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "RSVP" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "RSVP" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Event" ALTER COLUMN "startDate" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "Event" ALTER COLUMN "endDate" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "Scancode" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "Scancode" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Scancode" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "Scancode" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_eventId_Event_id_fk" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Scancode" ADD CONSTRAINT "Scancode_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "calendarSecret";