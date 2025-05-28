ALTER TABLE "RSVP" RENAME TO "rsvp";--> statement-breakpoint
ALTER TABLE "Scancode" RENAME TO "scancode";--> statement-breakpoint
ALTER TABLE "ApiKey" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "ApiKey" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "ApiKey" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "EventParsingRule" RENAME COLUMN "kronosId" TO "krnos_id";--> statement-breakpoint
ALTER TABLE "EventParsingRule" RENAME COLUMN "channelId" TO "channel_id";--> statement-breakpoint
ALTER TABLE "EventParsingRule" RENAME COLUMN "rolesIds" TO "role_ids";--> statement-breakpoint
ALTER TABLE "EventParsingRule" RENAME COLUMN "isOutreach" TO "is_outreach";--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "startDate" TO "start_date";--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "endDate" TO "end_date";--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "allDay" TO "all_day";--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "isSyncedEvent" TO "is_synced_event";--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "isPosted" TO "is_posted";--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "ruleId" TO "rule_id";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "eventId" TO "event_id";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "arrivingAt" TO "arriving_at";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "leavingAt" TO "leaving_at";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "checkinTime" TO "checkin_time";--> statement-breakpoint
ALTER TABLE "rsvp" RENAME COLUMN "checkoutTime" TO "checkout_time";--> statement-breakpoint
ALTER TABLE "scancode" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "scancode" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "scancode" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_createdBy_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Event" DROP CONSTRAINT "Event_ruleId_EventParsingRule_id_fk";
--> statement-breakpoint
ALTER TABLE "rsvp" DROP CONSTRAINT "RSVP_eventId_Event_id_fk";
--> statement-breakpoint
ALTER TABLE "rsvp" DROP CONSTRAINT "RSVP_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "scancode" DROP CONSTRAINT "Scancode_userId_User_id_fk";
--> statement-breakpoint
DROP INDEX "RSVP_eventId_userId_key";--> statement-breakpoint
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_created_by_User_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_rule_id_EventParsingRule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."EventParsingRule"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "scancode" ADD CONSTRAINT "scancode_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "RSVP_eventId_userId_key" ON "rsvp" USING btree ("event_id","user_id");