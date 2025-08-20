/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Racer` table. All the data in the column will be lost.
  - You are about to drop the column `club` on the `Racer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Racer` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `Racer` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `Racer` table. All the data in the column will be lost.
  - Added the required column `personalDataId` to the `Racer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PersonalData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "sex" TEXT NOT NULL,
    "club" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Racer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "personalDataId" INTEGER NOT NULL,
    "startingNumber" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Racer_personalDataId_fkey" FOREIGN KEY ("personalDataId") REFERENCES "PersonalData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Racer_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("createdAt", "id", "raceId", "startingNumber", "updatedAt") SELECT "createdAt", "id", "raceId", "startingNumber", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
CREATE UNIQUE INDEX "Racer_startingNumber_raceId_key" ON "Racer"("startingNumber", "raceId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Racer'
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "name") SELECT "email", "emailVerified", "id", "image", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
