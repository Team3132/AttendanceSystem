ALTER TABLE "parsing_rule" DROP COLUMN "cron_id";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."event_type";