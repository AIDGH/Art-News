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
GET /articles/:slug
GET /categories
GET /categories/:slug/articles
```

فهرست Article فقط رکوردهای `PUBLISHED` با `publishedAt <= now` را برمی‌گرداند.

پارامترهای `GET /articles`:

```text
page
pageSize
category
query
```

## Planned Editorial Endpoints

```text
POST   /auth/login
POST   /auth/logout
GET    /editorial/articles
POST   /editorial/articles
PATCH  /editorial/articles/:id
POST   /editorial/articles/:id/submit
POST   /editorial/articles/:id/publish
POST   /editorial/media
```

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
