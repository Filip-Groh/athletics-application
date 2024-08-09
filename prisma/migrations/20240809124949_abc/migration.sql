/*
  Warnings:

  - Added the required column `a` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `b` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `c` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
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
    "c" REAL NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Event_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("category", "createdAt", "id", "name", "raceId", "updatedAt") SELECT "category", "createdAt", "id", "name", "raceId", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
