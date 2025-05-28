DELETE FROM "parsing_rule"; --> statement-breakpoint
ALTER TABLE "parsing_rule" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parsing_rule" ADD COLUMN "cron_expr" text NOT NULL;