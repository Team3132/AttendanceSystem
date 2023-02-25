/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "secret" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultStatus" "RSVPStatus" NOT NULL DEFAULT 'NO';

-- CreateIndex
CREATE UNIQUE INDEX "Event_secret_key" ON "Event"("secret");
