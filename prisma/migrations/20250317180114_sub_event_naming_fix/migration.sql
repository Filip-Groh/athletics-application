/*
  Warnings:

  - You are about to drop the `Subevent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `subeventId` on the `AgeCoeficient` table. All the data in the column will be lost.
  - You are about to drop the column `subeventId` on the `Performance` table. All the data in the column will be lost.
  - Added the required column `subEventId` to the `AgeCoeficient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subEventId` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subevent_name_eventId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Subevent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SubEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "a" REAL NOT NULL,
    "b" REAL NOT NULL,
    "c" REAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    CONSTRAINT "SubEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "subEventId" INTEGER NOT NULL,
    CONSTRAINT "AgeCoeficient_subEventId_fkey" FOREIGN KEY ("subEventId") REFERENCES "SubEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AgeCoeficient" ("age", "coeficient", "createdAt", "id", "updatedAt") SELECT "age", "coeficient", "createdAt", "id", "updatedAt" FROM "AgeCoeficient";
DROP TABLE "AgeCoeficient";
ALTER TABLE "new_AgeCoeficient" RENAME TO "AgeCoeficient";
CREATE UNIQUE INDEX "AgeCoeficient_age_subEventId_key" ON "AgeCoeficient"("age", "subEventId");
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "subEventId" INTEGER NOT NULL,
    "racerId" INTEGER NOT NULL,
    CONSTRAINT "Performance_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_subEventId_fkey" FOREIGN KEY ("subEventId") REFERENCES "SubEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Performance" ("createdAt", "id", "orderNumber", "raceId", "racerId", "updatedAt") SELECT "createdAt", "id", "orderNumber", "raceId", "racerId", "updatedAt" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE UNIQUE INDEX "Performance_racerId_subEventId_raceId_key" ON "Performance"("racerId", "subEventId", "raceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SubEvent_name_eventId_key" ON "SubEvent"("name", "eventId");
