ALTER TABLE "EventParsingRule" RENAME COLUMN "roles" TO "rolesIds";--> statement-breakpoint
ALTER TABLE "EventParsingRule" DROP CONSTRAINT "EventParsingRule_name_unique";--> statement-breakpoint
ALTER TABLE "EventParsingRule" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "EventParsingRule" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "EventParsingRule" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "EventParsingRule" DROP COLUMN "schedule";