# Changelog

## 2026-09-02

- تغییر نام عمومی سایت از «هنرنامه» به «سینما نمایش» در رابط، metadata،
  structured data، نام تحریریه و کارت Open Graph.
- بازنویسی دسته‌بندی‌ها، خبرهای نمونه، متن رابط و metadata برای رسانه تخصصی
  سینما و نمایش.
- اضافه‌شدن منوی همبرگری مشترک موبایل و دسکتاپ با زیرمنوی سینما، مدیریت focus،
  قفل scroll و بسته‌شدن با کلیک بیرون، Escape یا انتخاب لینک.
- اضافه‌شدن Placeholder مشترک اکران نیوز و تبلیغات به صفحه اصلی، دسته‌بندی و
  جزئیات خبر.
- اضافه‌شدن صفحه‌های نمایشی `English` و «درباره ما» برای جلوگیری از لینک منوی
  بدون مقصد.
- به‌روزرسانی شعار کارت Open Graph به «رسانه سینما و نمایش».

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
