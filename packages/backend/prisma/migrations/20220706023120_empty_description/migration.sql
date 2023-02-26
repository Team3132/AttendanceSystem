/*
  Warnings:

  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT E'';
