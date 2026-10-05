CREATE TABLE "MediaPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "coverId" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MediaPost_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "MediaAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "MediaPostItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "MediaPostItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MediaPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediaPostItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "MediaPost_kind_status_publishedAt_idx" ON "MediaPost"("kind", "status", "publishedAt");
CREATE UNIQUE INDEX "MediaPostItem_postId_position_key" ON "MediaPostItem"("postId", "position");
CREATE INDEX "MediaPostItem_mediaId_idx" ON "MediaPostItem"("mediaId");
