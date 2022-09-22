/*
  Warnings:

  - Added the required column `themeObjects` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Made the column `activeTheme` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "activeTheme" TEXT NOT NULL,
    "availableThemes" TEXT NOT NULL,
    "usedTokenSet" TEXT NOT NULL,
    "themeObjects" TEXT NOT NULL
);
INSERT INTO "new_Token" ("activeTheme", "availableThemes", "id", "usedTokenSet", "userId") SELECT "activeTheme", "availableThemes", "id", "usedTokenSet", "userId" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
