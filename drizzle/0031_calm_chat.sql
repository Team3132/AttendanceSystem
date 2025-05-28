ALTER TYPE "public"."EventTypes" RENAME TO "event_type";--> statement-breakpoint
ALTER TYPE "public"."RSVPStatus" RENAME TO "rsvp_status";--> statement-breakpoint
ALTER TABLE "ApiKey" RENAME TO "api_key";--> statement-breakpoint
ALTER TABLE "EventParsingRule" RENAME TO "parsing_rule";--> statement-breakpoint
ALTER TABLE "Event" RENAME TO "event";--> statement-breakpoint
ALTER TABLE "User" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "accessToken" TO "access_token";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "refreshToken" TO "refresh_token";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "accessTokenExpiresAt" TO "access_token_expires_at";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "defaultStatus" TO "default_status";--> statement-breakpoint
ALTER TABLE "api_key" DROP CONSTRAINT "ApiKey_created_by_User_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "Event_rule_id_EventParsingRule_id_fk";
--> statement-breakpoint
ALTER TABLE "rsvp" DROP CONSTRAINT "rsvp_event_id_Event_id_fk";
--> statement-breakpoint
ALTER TABLE "rsvp" DROP CONSTRAINT "rsvp_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "scancode" DROP CONSTRAINT "scancode_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_rule_id_parsing_rule_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."parsing_rule"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "scancode" ADD CONSTRAINT "scancode_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;