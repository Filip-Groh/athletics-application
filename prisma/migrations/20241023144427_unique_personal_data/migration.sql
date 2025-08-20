/*
  Warnings:

  - A unique constraint covering the columns `[personalDataId]` on the table `Racer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Racer_personalDataId_key" ON "Racer"("personalDataId");
