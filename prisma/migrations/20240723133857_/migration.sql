/*
  Warnings:

  - A unique constraint covering the columns `[racerId,eventId]` on the table `Performance` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Measurement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "value" TEXT NOT NULL,
    "performanceId" INTEGER NOT NULL,
    CONSTRAINT "Measurement_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Measurement" ("createdAt", "id", "performanceId", "updatedAt", "value") SELECT "createdAt", "id", "performanceId", "updatedAt", "value" FROM "Measurement";
DROP TABLE "Measurement";
ALTER TABLE "new_Measurement" RENAME TO "Measurement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Performance_racerId_eventId_key" ON "Performance"("racerId", "eventId");
