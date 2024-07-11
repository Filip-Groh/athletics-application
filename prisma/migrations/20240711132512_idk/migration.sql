/*
  Warnings:

  - You are about to drop the column `datum` on the `Race` table. All the data in the column will be lost.
  - You are about to drop the column `coach` on the `Racer` table. All the data in the column will be lost.
  - Added the required column `date` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "organizer" TEXT NOT NULL
);
INSERT INTO "new_Race" ("createdAt", "id", "name", "organizer", "updatedAt") SELECT "createdAt", "id", "name", "organizer", "updatedAt" FROM "Race";
DROP TABLE "Race";
ALTER TABLE "new_Race" RENAME TO "Race";
CREATE TABLE "new_Racer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "sex" TEXT NOT NULL,
    "club" TEXT NOT NULL
);
INSERT INTO "new_Racer" ("birthDate", "club", "createdAt", "id", "name", "sex", "surname", "updatedAt") SELECT "birthDate", "club", "createdAt", "id", "name", "sex", "surname", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
