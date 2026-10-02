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

### ArticleContentBlock و ArticleBlockImage

هر خبر صفر یا چند بخش مرتب با `kind=TEXT|IMAGES` و `position` دارد. متن در
خود بخش و عکس‌ها در رابطه مرتب ArticleBlockImage به MediaAsset نگهداری می‌شوند.
قید یکتای `(blockId, position)` و indexهای ترتیب/رسانه اضافه شدند. حذف بخش،
رابطه عکس‌ها را cascade حذف می‌کند ولی خود فایل/MediaAsset را حذف نمی‌کند.
خبرهای قدیمی بدون بخش اضافه، body و cover فعلی خود را حفظ می‌کنند.

### Advertisement

عنوان، متن و لینک اختیاری، mediaId، جایگاه `ALL|HOME|ARTICLE|CATEGORY`، enabled،
startsAt/endsAt nullable و displayOrder را نگهداری می‌کند. وضعیت مؤثر از ساعت
فعلی محاسبه می‌شود و در ستون جدا ذخیره نمی‌شود. relation رسانه Restrict است؛
حذف تبلیغ فقط رکورد تبلیغ را پاک می‌کند. index روی enabled/placement/displayOrder
برای انتخاب موارد عمومی وجود دارد.

مهاجرت `20261002100000_add_ads_and_article_blocks` این سه جدول را اضافه می‌کند؛
به ردیف‌های خبر، نظر، لایک یا کاربران موجود دست نمی‌زند. seed دوباره لازم نیست.

### Tag and ArticleTag

رابطه چندبه‌چند برای موضوعات فرعی.

### MediaAsset

metadata فایل شامل URL، alt، credit، caption، width، height و mime type.
رابطه‌های blockImages و advertisements نیز دارد؛ IMAGE و VIDEO برای رسانه‌های
تبلیغاتی استفاده می‌شوند و رسانه ویدیویی در گروه عکس خبر مجاز نیست.

### ArticleSource

منبع قابل‌ردیابی خبر شامل URL، title، publisher، author، publishedAt و
accessedAt.

### HomepagePlacement

جایگاه و ترتیب Articleهای منتخب روی صفحه اصلی بدون کپی اطلاعات خبر.

### SiteSettings

رکورد singleton با شناسه ثابت `site` برای متن معرفی فوتر و بدنه قابل‌ویرایش
صفحه «درباره ما». این رکورد داده عمومی است اما فقط endpoint محافظت‌شده پنل آن
را تغییر می‌دهد.

### ArticleComment

نام و متن نظر به خبر متصل‌اند. `PENDING`، `APPROVED` و `REJECTED` وضعیت‌های
بررسی‌اند؛ فقط `APPROVED` عمومی است. شناسه ناشناس مرورگر برای محدودکردن ارسال
پیاپی ذخیره می‌شود؛ کوکی و نام کاربر هویت واقعی را ثابت نمی‌کنند.

### ArticleLike و CommentLike

هر لایک با شناسه ناشناس مرورگر ثبت می‌شود. unique روی `(articleId, visitorId)`
و `(commentId, visitorId)` مانع لایک تکراری همان مرورگر است. لایک نظر فقط برای
نظر تأییدشده پذیرفته می‌شود. تغییر مرورگر یا حذف کوکی این محدودیت را دور می‌زند.

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
