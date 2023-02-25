/*
  Warnings:

  - You are about to drop the column `discordRefreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordRefreshToken";
