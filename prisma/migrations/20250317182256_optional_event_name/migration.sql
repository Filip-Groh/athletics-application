-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Event" ("category", "createdAt", "id", "name", "updatedAt") SELECT "category", "createdAt", "id", "name", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_category_key" ON "Event"("name", "category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
