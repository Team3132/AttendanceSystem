DELETE FROM "parsing_rule";--> statement-breakpoint
ALTER TABLE "parsing_rule" ADD COLUMN "cron_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parsing_rule" DROP COLUMN "kronos_id";