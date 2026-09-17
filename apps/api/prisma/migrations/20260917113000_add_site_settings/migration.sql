-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'site',
    "footerDescription" TEXT NOT NULL,
    "aboutBody" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- Seed the singleton settings row with the approved footer text and no about body.
INSERT INTO "SiteSettings" ("id", "footerDescription", "aboutBody", "updatedAt")
VALUES (
    'site',
    'پایگاه خبری سینما نمایش، رسانه انتشار تازه‌ترین و مهم‌ترین اخبار فرهنگی است',
    '',
    CURRENT_TIMESTAMP
);

-- Rename the existing editorial category without changing its stable route slug.
UPDATE "Category"
SET "title" = 'گزارش',
    "description" = 'گزارش‌ها، برنامه‌های نمایش و رویدادهای ویژه فیلم',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'screenings';
