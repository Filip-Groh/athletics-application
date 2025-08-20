-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PersonalData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "sex" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "PersonalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PersonalData" ("birthDate", "club", "createdAt", "id", "name", "sex", "surname", "updatedAt") SELECT "birthDate", "club", "createdAt", "id", "name", "sex", "surname", "updatedAt" FROM "PersonalData";
DROP TABLE "PersonalData";
ALTER TABLE "new_PersonalData" RENAME TO "PersonalData";
CREATE UNIQUE INDEX "PersonalData_userId_key" ON "PersonalData"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
