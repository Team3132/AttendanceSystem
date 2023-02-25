/*
  Warnings:

  - You are about to drop the column `defaultStatus` on the `User` table. All the data in the column will be lost.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultStatus",
ALTER COLUMN "username" SET NOT NULL;
