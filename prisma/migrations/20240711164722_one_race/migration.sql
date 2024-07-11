/*
  Warnings:

  - You are about to drop the `_RaceToRacer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `raceId` to the `Racer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_RaceToRacer_B_index";

-- DropIndex
DROP INDEX "_RaceToRacer_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_RaceToRacer";
PRAGMA foreign_keys=on;

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
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Racer_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("birthDate", "club", "createdAt", "id", "name", "sex", "surname", "updatedAt") SELECT "birthDate", "club", "createdAt", "id", "name", "sex", "surname", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
