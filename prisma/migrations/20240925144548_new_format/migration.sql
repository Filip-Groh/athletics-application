/*
  Warnings:

  - You are about to drop the column `raceId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `raceId` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_EventToRace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToRace_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToRace_B_fkey" FOREIGN KEY ("B") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "a" REAL NOT NULL,
    "b" REAL NOT NULL,
    "c" REAL NOT NULL
);
INSERT INTO "new_Event" ("a", "b", "c", "category", "createdAt", "id", "name", "updatedAt") SELECT "a", "b", "c", "category", "createdAt", "id", "name", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_category_key" ON "Event"("name", "category");
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "racerId" INTEGER NOT NULL,
    CONSTRAINT "Performance_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Performance_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Performance" ("createdAt", "eventId", "id", "orderNumber", "racerId", "updatedAt") SELECT "createdAt", "eventId", "id", "orderNumber", "racerId", "updatedAt" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE UNIQUE INDEX "Performance_racerId_eventId_raceId_key" ON "Performance"("racerId", "eventId", "raceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_EventToRace_AB_unique" ON "_EventToRace"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToRace_B_index" ON "_EventToRace"("B");
