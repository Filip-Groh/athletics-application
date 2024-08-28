/*
  Warnings:

  - A unique constraint covering the columns `[startingNumber,raceId]` on the table `Racer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Racer_startingNumber_raceId_key" ON "Racer"("startingNumber", "raceId");
