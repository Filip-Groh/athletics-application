/*
  Warnings:

  - Added the required column `orderNumber` to the `Racer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingNumber` to the `Racer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "orderNumber" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Racer_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("birthDate", "club", "createdAt", "id", "name", "raceId", "sex", "surname", "updatedAt") SELECT "birthDate", "club", "createdAt", "id", "name", "raceId", "sex", "surname", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
