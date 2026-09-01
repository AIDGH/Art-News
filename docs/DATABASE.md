# Art News Database

## Overview

Database اصلی PostgreSQL و ORM پروژه Prisma است.

## Core Models

### User

عضو تحریریه با roleهای `AUTHOR`، `EDITOR` و `ADMIN`.

### Article

رکورد اصلی خبر شامل slug، title، lead، body، status، زمان انتشار، نویسنده،
دسته‌بندی و تصویر اصلی.

### Category

دسته‌بندی اصلی خبر. هر Article در MVP یک Category اصلی دارد.

### Tag and ArticleTag

رابطه چندبه‌چند برای موضوعات فرعی.

### MediaAsset

metadata فایل شامل URL، alt، credit، caption، width، height و mime type.

### ArticleSource

منبع قابل‌ردیابی خبر شامل URL، title، publisher، author، publishedAt و
accessedAt.

### HomepagePlacement

جایگاه و ترتیب Articleهای منتخب روی صفحه اصلی بدون کپی اطلاعات خبر.

## Publication Status

```text
DRAFT
IN_REVIEW
SCHEDULED
PUBLISHED
ARCHIVED
```

## Principles

- slug یکتا و پایدار است.
- زمان publication با timezone-safe timestamp ذخیره می‌شود.
- Article منتشرشده بدون title، lead، body، category، cover alt و publishedAt
  معتبر نیست.
- query عمومی فقط `PUBLISHED` با `publishedAt <= now` را نمایش می‌دهد.
- حذف خبر منتشرشده باید به archive ترجیح داده شود.
- migrationها تنها مسیر تغییر schema هستند.
