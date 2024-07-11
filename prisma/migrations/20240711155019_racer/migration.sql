-- CreateTable
CREATE TABLE "_RaceToRacer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RaceToRacer_A_fkey" FOREIGN KEY ("A") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RaceToRacer_B_fkey" FOREIGN KEY ("B") REFERENCES "Racer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_RaceToRacer_AB_unique" ON "_RaceToRacer"("A", "B");

-- CreateIndex
CREATE INDEX "_RaceToRacer_B_index" ON "_RaceToRacer"("B");
