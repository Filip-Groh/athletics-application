/*
  Warnings:

  - You are about to drop the column `orderNumber` on the `Racer` table. All the data in the column will be lost.
  - Added the required column `orderNumber` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "racerId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    CONSTRAINT "Performance_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Performance" ("createdAt", "eventId", "id", "racerId", "updatedAt") SELECT "createdAt", "eventId", "id", "racerId", "updatedAt" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE UNIQUE INDEX "Performance_racerId_eventId_key" ON "Performance"("racerId", "eventId");
CREATE TABLE "new_Racer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "sex" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "startingNumber" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Racer_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("birthDate", "club", "createdAt", "id", "name", "raceId", "sex", "startingNumber", "surname", "updatedAt") SELECT "birthDate", "club", "createdAt", "id", "name", "raceId", "sex", "startingNumber", "surname", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
CREATE UNIQUE INDEX "Racer_startingNumber_raceId_key" ON "Racer"("startingNumber", "raceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
