-- Add the production category without running the demo/admin seed.
-- Keep any existing English category and editorial ordering unchanged.
INSERT INTO "Category" (
    "id", "slug", "title", "description", "sortOrder", "createdAt", "updatedAt"
)
SELECT
    'e67c9550-dbc3-4c17-984c-f118c401b006',
    'english',
    'انگلیسی',
    'English-language news and coverage',
    COALESCE((SELECT MAX("sortOrder") FROM "Category"), -1) + 1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "slug" = 'english');
