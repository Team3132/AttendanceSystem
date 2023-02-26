-- CreateEnum
CREATE TYPE "EventTypes" AS ENUM ('Outreach', 'Regular', 'Social');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "type" "EventTypes" NOT NULL DEFAULT 'Regular';
