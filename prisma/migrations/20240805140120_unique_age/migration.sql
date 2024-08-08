/*
  Warnings:

  - A unique constraint covering the columns `[age,eventId]` on the table `AgeCoeficient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AgeCoeficient_age_eventId_key" ON "AgeCoeficient"("age", "eventId");
