CREATE TABLE "kv" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text,
	"expires_at" timestamp (3) with time zone
);
