ALTER TABLE "Event" DROP CONSTRAINT "Event_ruleId_EventParsingRule_id_fk";
--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_ruleId_EventParsingRule_id_fk" FOREIGN KEY ("ruleId") REFERENCES "public"."EventParsingRule"("id") ON DELETE set null ON UPDATE no action;