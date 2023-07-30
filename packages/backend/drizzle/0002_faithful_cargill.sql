ALTER TABLE "Event" ALTER COLUMN "startDate" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "Event" ALTER COLUMN "endDate" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "RSVP" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "RSVP" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "Scancode" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "Scancode" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(3);