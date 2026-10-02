CREATE TABLE "ArticleContentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "text" TEXT,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ArticleContentBlock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "ArticleBlockImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blockId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ArticleBlockImage_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "ArticleContentBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleBlockImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "Advertisement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "text" TEXT,
    "targetUrl" TEXT,
    "mediaId" TEXT NOT NULL,
    "placement" TEXT NOT NULL DEFAULT 'ALL',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Advertisement_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "ArticleContentBlock_articleId_position_idx" ON "ArticleContentBlock"("articleId", "position");
CREATE UNIQUE INDEX "ArticleBlockImage_blockId_position_key" ON "ArticleBlockImage"("blockId", "position");
CREATE INDEX "ArticleBlockImage_mediaId_idx" ON "ArticleBlockImage"("mediaId");
CREATE INDEX "Advertisement_enabled_placement_displayOrder_idx" ON "Advertisement"("enabled", "placement", "displayOrder");
