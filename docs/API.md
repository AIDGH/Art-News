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
GET /categories/:slug/articles
GET /site-settings
GET /articles/:slug/engagement
POST /articles/:slug/engagement/comments
POST /articles/:slug/engagement/likes
POST /articles/:slug/engagement/comments/:commentId/likes
```

فهرست Article رکوردهای `PUBLISHED` و خبرهای `SCHEDULED` رسیده به زمان
`publishedAt <= now` را برمی‌گرداند.

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
GET    /editorial/categories
POST   /editorial/categories
PATCH  /editorial/categories/:id
GET    /editorial/site-settings
PUT    /editorial/site-settings
GET    /editorial/media
POST   /editorial/media
PATCH  /editorial/media/:id
```

ساخت و ویرایش خبر شامل title، slug، lead، body، categoryId، coverImageId،
status، publishedAt، SEO، tags، sources، featured و featuredOrder است.
آپلود تصویر multipart با نام فیلد `file` انجام می‌شود؛ JPEG، PNG، WebP و GIF تا
حداکثر ۸ مگابایت پذیرفته می‌شوند.
تنظیمات سایت شامل `footerDescription` و `aboutBody` است؛ متن فوتر اجباری و متن
درباره ما می‌تواند خالی باشد.

نظر عمومی با `{ "name": "...", "body": "..." }` ثبت می‌شود و ابتدا
`PENDING` است. پنل با `{ "status": "APPROVED" }` یا `REJECTED` تصمیم می‌گیرد.
فقط نظرهای `APPROVED` به همراه شمار لایک به خوانندگان بازگردانده می‌شوند.
لایک‌های POST تکراری از همان کوکی ناشناس مقدار شمارنده را تغییر نمی‌دهند.
کوکی `cinema_visitor` از نوع HttpOnly و SameSite=Lax است و روی HTTPS ویژگی
Secure دارد. حذف کوکی یا مرورگر دیگر می‌تواند هویت تازه ایجاد کند؛ این سازوکار
هویت انسانی را تأیید نمی‌کند. ارسال نظر از همان کوکی در هر دقیقه یک بار مجاز است.

## Response Shape

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
