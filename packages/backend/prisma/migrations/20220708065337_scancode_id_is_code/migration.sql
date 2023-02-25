/*
  Warnings:

  - The primary key for the `Scancode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Scancode` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Scancode_code_key";

-- AlterTable
ALTER TABLE "Scancode" DROP CONSTRAINT "Scancode_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Scancode_pkey" PRIMARY KEY ("code");
