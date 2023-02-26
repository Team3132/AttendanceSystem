/*
  Warnings:

  - You are about to drop the column `lateTime` on the `RSVP` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "RSVPStatus" ADD VALUE 'LATE';

-- AlterTable
ALTER TABLE "RSVP" DROP COLUMN "lateTime";
