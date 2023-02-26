/*
  Warnings:

  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "RSVPStatus" ADD VALUE 'ATTENDED';

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropTable
DROP TABLE "Attendance";

-- DropEnum
DROP TYPE "AttendanceStatus";
