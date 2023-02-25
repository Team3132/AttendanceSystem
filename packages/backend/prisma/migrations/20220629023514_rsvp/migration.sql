/*
  Warnings:

  - Added the required column `status` to the `RSVP` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('YES', 'NO', 'MAYBE');

-- AlterTable
ALTER TABLE "RSVP" ADD COLUMN     "status" "RSVPStatus" NOT NULL;
