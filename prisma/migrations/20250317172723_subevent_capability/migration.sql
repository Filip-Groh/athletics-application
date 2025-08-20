/*
  Warnings:

  - You are about to drop the column `eventId` on the `AgeCoeficient` table. All the data in the column will be lost.
  - You are about to drop the column `a` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `b` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `c` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Performance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalDataId,startingNumber,raceId]` on the table `Racer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subeventId` to the `AgeCoeficient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subeventId` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Racer_personalDataId_key";

-- DropIndex
DROP INDEX "Racer_startingNumber_raceId_key";

-- CreateTable
CREATE TABLE "Subevent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "a" REAL NOT NULL,
    "b" REAL NOT NULL,
    "c" REAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    CONSTRAINT "Subevent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_manager" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_manager_A_fkey" FOREIGN KEY ("A") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_manager_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgeCoeficient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "coeficient" REAL NOT NULL,
    "subeventId" INTEGER NOT NULL,
    CONSTRAINT "AgeCoeficient_subeventId_fkey" FOREIGN KEY ("subeventId") REFERENCES "Subevent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AgeCoeficient" ("age", "coeficient", "createdAt", "id", "updatedAt") SELECT "age", "coeficient", "createdAt", "id", "updatedAt" FROM "AgeCoeficient";
DROP TABLE "AgeCoeficient";
ALTER TABLE "new_AgeCoeficient" RENAME TO "AgeCoeficient";
CREATE UNIQUE INDEX "AgeCoeficient_age_subeventId_key" ON "AgeCoeficient"("age", "subeventId");
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Event" ("category", "createdAt", "id", "name", "updatedAt") SELECT "category", "createdAt", "id", "name", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_category_key" ON "Event"("name", "category");
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "subeventId" INTEGER NOT NULL,
    "racerId" INTEGER NOT NULL,
    CONSTRAINT "Performance_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_subeventId_fkey" FOREIGN KEY ("subeventId") REFERENCES "Subevent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Performance" ("createdAt", "id", "orderNumber", "raceId", "racerId", "updatedAt") SELECT "createdAt", "id", "orderNumber", "raceId", "racerId", "updatedAt" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE UNIQUE INDEX "Performance_racerId_subeventId_raceId_key" ON "Performance"("racerId", "subeventId", "raceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Subevent_name_eventId_key" ON "Subevent"("name", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "_manager_AB_unique" ON "_manager"("A", "B");

-- CreateIndex
CREATE INDEX "_manager_B_index" ON "_manager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Racer_personalDataId_startingNumber_raceId_key" ON "Racer"("personalDataId", "startingNumber", "raceId");
