/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `RSVP` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RSVP_eventId_userId_key" ON "RSVP"("eventId", "userId");
