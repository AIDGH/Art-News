# Art News Database

## Overview

Database فعلی SQLite و ORM پروژه Prisma است. فایل توسعه `apps/api/dev.db` داخل
Git قرار نمی‌گیرد. مهاجرت احتمالی آینده به PostgreSQL یک تصمیم استقراری جداست.

## Core Models

### User

عضو سینما نمایش با roleهای `AUTHOR`، `EDITOR` و `ADMIN`.

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
- password کاربر با scrypt hash می‌شود و رمز خام ذخیره نمی‌شود.
- انتخاب خبر مهم با رکورد HomepagePlacement از نوع LEAD و displayOrder کنترل
  می‌شود؛ صفحه اصلی این ترتیب را مستقیماً از API دریافت می‌کند.
