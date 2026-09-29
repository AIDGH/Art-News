CREATE TABLE "ArticleComment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "articleId" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "moderatedAt" DATETIME,
  CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ArticleComment_articleId_status_createdAt_idx" ON "ArticleComment"("articleId", "status", "createdAt");
CREATE INDEX "ArticleComment_status_createdAt_idx" ON "ArticleComment"("status", "createdAt");
CREATE INDEX "ArticleComment_visitorId_createdAt_idx" ON "ArticleComment"("visitorId", "createdAt");

CREATE TABLE "ArticleLike" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "articleId" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ArticleLike_articleId_visitorId_key" ON "ArticleLike"("articleId", "visitorId");

CREATE TABLE "CommentLike" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "commentId" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ArticleComment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CommentLike_commentId_visitorId_key" ON "CommentLike"("commentId", "visitorId");
