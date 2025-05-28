ALTER TABLE "User" ADD COLUMN "accessToken" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "refreshToken" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "expiresAt" timestamp(3) with time zone;