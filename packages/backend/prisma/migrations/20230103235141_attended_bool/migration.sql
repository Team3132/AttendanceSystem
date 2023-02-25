/*
  Warnings:

  - The values [ATTENDED] on the enum `RSVPStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `attended` to the `RSVP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RSVPStatus_new" AS ENUM ('YES', 'NO', 'MAYBE');
ALTER TABLE "User" ALTER COLUMN "defaultStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "defaultStatus" TYPE "RSVPStatus_new" USING ("defaultStatus"::text::"RSVPStatus_new");
ALTER TABLE "RSVP" ALTER COLUMN "status" TYPE "RSVPStatus_new" USING ("status"::text::"RSVPStatus_new");
ALTER TYPE "RSVPStatus" RENAME TO "RSVPStatus_old";
ALTER TYPE "RSVPStatus_new" RENAME TO "RSVPStatus";
DROP TYPE "RSVPStatus_old";
ALTER TABLE "User" ALTER COLUMN "defaultStatus" SET DEFAULT 'NO';
COMMIT;

-- AlterTable
ALTER TABLE "RSVP" ADD COLUMN     "attended" BOOLEAN NOT NULL;
