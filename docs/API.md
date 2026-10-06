# Art News API

## Overview

Base path:

```text
/api/v1
```

آدرس پیش‌فرض توسعه مستقیم و مسیر proxy فرانت:

```text
http://localhost:4001/api/v1
http://localhost:3001/api/v1
```

## Public Endpoints

```text
GET /health
GET /articles
GET /articles/featured
GET /articles/:slug
GET /categories
GET /categories/latest
GET /categories/:slug/articles
GET /site-settings
GET /advertisements?placement=HOME|ARTICLE|CATEGORY|ALL
GET /articles/:slug/engagement
POST /articles/:slug/engagement/comments
POST /articles/:slug/engagement/likes
POST /articles/:slug/engagement/comments/:commentId/likes
```

فهرست Article رکوردهای `PUBLISHED` و خبرهای `SCHEDULED` رسیده به زمان
`publishedAt <= now` را برمی‌گرداند.

`GET /categories/latest` آرایه `data` از تازه‌ترین محتوای هر دسته با
`category`، `contentType: ARTICLE|MEDIA`، `slug` (شناسه آلبوم برای MEDIA)،
`title`، `publishedAt` و `coverImage: {url, alt}|null` برمی‌گرداند.
انتخاب خبر داخل هر دسته مستقل از صفحه‌بندی کلی است؛ فقط خبر منتشرشده یا
زمان‌بندی‌شده‌ای که موعدش رسیده لحاظ می‌شود. در `photos` و `videos` جدیدترین
آلبوم منتشرشده نیز با جدیدترین خبر مقایسه می‌شود؛ در تاریخ برابر آلبوم اولویت
دارد. دسته بدون محتوای عمومی حذف می‌شود. متن کامل یا فایل ویدیو دریافت نمی‌شود.

پارامترهای `GET /articles`:

```text
page
pageSize
category
query
```

## Authentication Endpoints

```text
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

نشست با کوکی امضاشده HttpOnly برقرار می‌شود. تمام endpointهای `/editorial/*`
به نشست معتبر نیاز دارند. کوکی روی درخواست HTTPS دارای `Secure` است و روی HTTP
موقت IP بدون این ویژگی صادر می‌شود؛ `SameSite=Lax` و مسیر `/` ثابت می‌مانند.

## Editorial Endpoints

```text
GET    /editorial/articles
GET    /editorial/comments?status=PENDING|APPROVED|REJECTED
PATCH  /editorial/comments/:id
GET    /editorial/articles/:id
POST   /editorial/articles
PATCH  /editorial/articles/:id
POST   /editorial/articles/:id/archive
DELETE /editorial/articles/:id
GET    /editorial/categories
POST   /editorial/categories
PATCH  /editorial/categories/:id
GET    /editorial/site-settings
PUT    /editorial/site-settings
GET    /editorial/media
POST   /editorial/media
PATCH  /editorial/media/:id
GET    /editorial/advertisements?status=active|inactive
POST   /editorial/advertisements
PATCH  /editorial/advertisements/:id
POST   /editorial/advertisements/:id/activate
DELETE /editorial/advertisements/:id
```

ساخت و ویرایش خبر شامل title، slug، lead، body، categoryId، coverImageId،
status، publishedAt، SEO، tags، sources، featured و featuredOrder است.
حذف دائمی خبر به نشست معتبر نیاز دارد؛ پاسخ `{data: {id}}` است و شناسه ناموجود
۴۰۴ می‌دهد. روابط وابسته شامل نظرات/لایک‌ها، منابع، بخش‌ها و انتخاب اسلایدر
به‌صورت cascade حذف می‌شوند. فایل‌های آپلود، تگ‌ها و دسته‌بندی مشترک حذف نمی‌شوند.
این عملیات برگشت‌پذیر نیست؛ بایگانی همچنان گزینه توقف موقت نمایش است.
آپلود تصویر multipart با نام فیلد `file` انجام می‌شود؛ JPEG، PNG، WebP و GIF تا
حداکثر ۸ MiB پذیرفته می‌شوند؛ MP4 و WebM تبلیغات تا ۳۰ MiB با بررسی signature
پذیرفته می‌شوند. `GET /editorial/media?includeVideo=true` ویدیوها را هم برمی‌گرداند؛
حالت پیش‌فرض فقط تصویر است. ویدیو نمی‌تواند تصویر اصلی یا عکس داخل خبر باشد.
تنظیمات سایت شامل `footerDescription` و `aboutBody` است؛ متن فوتر اجباری و متن
درباره ما می‌تواند خالی باشد.

`contentBlocks` اختیاری در ساخت/ویرایش خبر آرایه مرتب تا ۵۰ بخش است:

```json
[
  { "kind": "IMAGES", "mediaIds": ["media-uuid-1", "media-uuid-2"] },
  { "kind": "TEXT", "text": "متن دوم خبر" }
]
```

هر گروه ۱ تا ۷ عکس دارد و متن هر بخش حداکثر ۵۰٬۰۰۰ نویسه است. پاسخ عمومی و
پنل بخش‌ها و عکس‌ها را به ترتیب ذخیره‌شده برمی‌گرداند. حذف فیلد از PATCH بخش‌ها
را حفظ می‌کند؛ `[]` آن‌ها را پاک می‌کند. `null` یا گروه خالی نامعتبر است.
PATCH بدون status، tags، sources یا featured این اطلاعات قبلی را نیز حفظ می‌کند؛
defaultهای مخصوص ساخت خبر دیگر به ویرایش جزئی اعمال نمی‌شوند.

قرارداد تبلیغ: `title` و `mediaId` الزامی؛ `text`، `targetUrl`، `startsAt` و
`endsAt` اختیاری/nullable هستند. مقصد فقط HTTP/HTTPS است. `placement` پیش‌فرض
`ALL`، `enabled` پیش‌فرض true و `displayOrder` پیش‌فرض صفر (۰ تا ۱۰۰۰) است.
تاریخ‌ها ISO8601 و پایان، در صورت وجود هر دو تاریخ، بعد از شروع است. پاسخ پنل
`effectiveStatus` از نوع `ACTIVE`/`SCHEDULED`/`EXPIRED`/`DISABLED` دارد؛ فیلتر
inactive سه وضعیت غیر ACTIVE را شامل می‌شود. فعال‌سازی اکنون شروع را تغییر
می‌دهد و پایانِ گذشته را حذف می‌کند. DELETE فقط رکورد تبلیغ را حذف می‌کند نه فایل.
GET عمومی با `Cache-Control: no-store` فقط موارد enabled و رسیده به شروع و
نرسیده به پایان را می‌دهد؛ جایگاه خاص، موارد `ALL` را نیز شامل می‌شود.

نظر عمومی با `{ "name": "...", "body": "..." }` ثبت می‌شود و ابتدا
`PENDING` است. پنل با `{ "status": "APPROVED" }` یا `REJECTED` تصمیم می‌گیرد.
فقط نظرهای `APPROVED` به همراه شمار لایک به خوانندگان بازگردانده می‌شوند.
لایک‌های POST تکراری از همان کوکی ناشناس مقدار شمارنده را تغییر نمی‌دهند.
کوکی `cinema_visitor` از نوع HttpOnly و SameSite=Lax است و روی HTTPS ویژگی
Secure دارد. حذف کوکی یا مرورگر دیگر می‌تواند هویت تازه ایجاد کند؛ این سازوکار
هویت انسانی را تأیید نمی‌کند. ارسال نظر از همان کوکی در هر دقیقه یک بار مجاز است.

## Response Shape

### Standalone media posts — 2026-10-05

- `GET /media-posts?kind=PHOTOS|VIDEOS&page=1&pageSize=12`: عمومی، no-store، فقط PUBLISHED با زمان رسیده؛ status ارسالی این شرط را تغییر نمی‌دهد.
- `GET /editorial/media-posts`: نشست لازم؛ فیلتر kind و status و صفحه‌بندی.
- `POST /editorial/media-posts`: ساخت؛ `PUT /editorial/media-posts/:id`: ویرایش کامل.
- `PATCH /editorial/media-posts/:id/status`: `{status: "DRAFT" | "PUBLISHED" | "ARCHIVED"}`.
- `DELETE /editorial/media-posts/:id`: حذف پست و روابط بدون حذف فایل مشترک.

بدنه ساخت/ویرایش: title (۲ تا ۲۰۰ نویسه trimشده)، description اختیاری تا ۳۰۰۰،
kind، status، coverId (UUID تصویر) و mediaIds (۱ تا ۷ UUID یکتا به ترتیب).
از ۲۰۲۶-۱۰-۰۶ فیلد `targetUrl` اختیاری است: آدرس کامل HTTP/HTTPS تا ۲۰۰۰
نویسه، trimشده؛ رشته خالی/null لینک را پاک می‌کند. در پاسخ عمومی و پنل نیز
برگردانده می‌شود. javascript، data، ftp و آدرس نسبی پذیرفته نمی‌شوند.
PHOTOS فقط تصویر و VIDEOS حداقل یک ویدیو دارد. فایل ناشناخته، کاور ویدیویی یا
نوع ناسازگار با 400 رد می‌شود. پاسخ cover و items مرتب با media دارد. meta:
`{page, pageSize, total, hasMore}`؛ pageSize حداکثر ۳۰. تغییر وضعیت زمان اولین
انتشار و فایل‌ها را حفظ می‌کند. upload همان `/editorial/media` با سقف تصویر
۸ MiB و MP4/WebM سی MiB است.

پاسخ جزئیات:

```json
{
  "data": {}
}
```

پاسخ فهرست:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

قرارداد دقیق endpointها هم‌زمان با implementation به‌روزرسانی می‌شود.
