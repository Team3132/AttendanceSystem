ALTER TABLE "Event" ADD COLUMN "ruleId" text;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_ruleId_EventParsingRule_id_fk" FOREIGN KEY ("ruleId") REFERENCES "public"."EventParsingRule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventParsingRule" ADD CONSTRAINT "EventParsingRule_name_unique" UNIQUE("name");