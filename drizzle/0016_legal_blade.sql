CREATE TABLE "ApiKey" (
	"id" text PRIMARY KEY NOT NULL,
	"createdBy" text,
	"createdAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "EventParsingRule" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"regex" text DEFAULT '' NOT NULL,
	"roles" text[] DEFAULT '{}' NOT NULL,
	"channelId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;