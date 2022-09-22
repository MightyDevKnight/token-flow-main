-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "activeTheme" TEXT,
    "availableThemes" TEXT NOT NULL,
    "usedTokenSet" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");
