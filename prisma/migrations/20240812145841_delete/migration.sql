-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgeCoeficient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "coeficient" REAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    CONSTRAINT "AgeCoeficient_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AgeCoeficient" ("age", "coeficient", "createdAt", "eventId", "id", "updatedAt") SELECT "age", "coeficient", "createdAt", "eventId", "id", "updatedAt" FROM "AgeCoeficient";
DROP TABLE "AgeCoeficient";
ALTER TABLE "new_AgeCoeficient" RENAME TO "AgeCoeficient";
CREATE UNIQUE INDEX "AgeCoeficient_age_eventId_key" ON "AgeCoeficient"("age", "eventId");
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
    CONSTRAINT "Event_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("a", "b", "c", "category", "createdAt", "id", "name", "raceId", "updatedAt") SELECT "a", "b", "c", "category", "createdAt", "id", "name", "raceId", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Measurement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "value" REAL,
    "performanceId" INTEGER NOT NULL,
    CONSTRAINT "Measurement_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Measurement" ("createdAt", "id", "performanceId", "updatedAt", "value") SELECT "createdAt", "id", "performanceId", "updatedAt", "value" FROM "Measurement";
DROP TABLE "Measurement";
ALTER TABLE "new_Measurement" RENAME TO "Measurement";
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Racer_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("birthDate", "club", "createdAt", "id", "name", "raceId", "sex", "surname", "updatedAt") SELECT "birthDate", "club", "createdAt", "id", "name", "raceId", "sex", "surname", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
