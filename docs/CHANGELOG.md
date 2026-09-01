# Changelog

## 2026-09-01

- اضافه‌شدن فایل self-hosted `Vazirmatn-Regular.woff2` در `apps/web/public/fonts`.
- اعمال Vazirmatn روی متن، تیترها، برند، صفحه خبر و جست‌وجو با `@font-face`.
- ساخت ۹ تصویرسازی اختصاصی برای خبرهای نمونه و ذخیره نسخه بهینه WebP در
  `apps/web/public/images/articles/`.
- حذف وابستگی تصاویر قالب به Unsplash و ثبت alt و credit شفاف برای تصاویر
  تولیدشده با هوش مصنوعی.

## 2026-08-31

- ایجاد مستندات پایه محصول و معماری.
- تعریف monorepo برای Next.js frontend و NestJS API.
- تعریف دامنه اولیه Article، Category، Tag، Media و Homepage Placement.
- آغاز قالب خبری فارسی و responsive با داده نمایشی.
- تکمیل صفحه اصلی، دسته‌بندی، جزئیات خبر و جست‌وجو.
- اضافه‌شدن metadata، canonical، Open Graph و `NewsArticle` JSON-LD.
- اضافه‌شدن کارت اشتراک‌گذاری اختصاصی «هنرنامه».
- پیاده‌سازی NestJS Health، Articles و Categories API.
- تعریف Prisma schema برای User، Article، Category، Tag، ArticleSource،
  MediaAsset و HomepagePlacement.
- موفقیت frontend/backend build، typecheck، lint، Prisma validation و تست پایه.
