CREATE TABLE IF NOT EXISTS "BuildPoints" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"points" integer NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"createdAt" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BuildPoints" ADD CONSTRAINT "BuildPoints_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
