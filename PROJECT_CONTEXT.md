# Art News — Project Context

> این فایل مرجع اصلی وضعیت فعلی پروژه و handoff بین گفت‌وگوهاست. جزئیات تخصصی
> در `docs/` نگهداری می‌شوند و این فایل باید خلاصه و به‌روز بماند.

آخرین به‌روزرسانی محتوایی: ۲۰۲۶-۰۹-۰۱

## 1. شیوه همکاری

- زبان توضیحات فارسی است و نام‌های فنی و کد انگلیسی باقی می‌مانند.
- HotelYab فقط مرجع read-only معماری است و هیچ تغییری در آن انجام نمی‌شود.
- تمام تغییرات این پروژه داخل repository فعلی انجام می‌شوند.
- قبل از تغییر معماری بزرگ هماهنگی انجام می‌شود.
- سادگی و خوانایی بر abstraction زودهنگام اولویت دارد.
- بدون درخواست صریح کاربر push انجام نمی‌شود.
- کامنت داخل کد، در صورت نیاز، فقط انگلیسی نوشته می‌شود.
- بعد از هر تغییر مشخص می‌شود کدام بخش این فایل و کدام فایل‌های `docs/` باید
  به‌روزرسانی شوند.

## 2. هدف محصول

Art News یک رسانه خبری فارسی و RTL با تمرکز بر هنر است. تحریریه خبرها را از
طریق پنل مدیریت ثبت، بازبینی، زمان‌بندی و منتشر می‌کند. خواندن محتوا عمومی است
و حساب کاربری مخاطب برای MVP ضروری نیست.

## 3. وضعیت فعلی

پایه فنی و قالب اولیه قابل‌نمایش پیاده‌سازی شده‌اند. پروژه اکنون monorepo فعال
با Next.js frontend، NestJS API و Prisma schema معتبر دارد. صفحه اصلی،
دسته‌بندی، جزئیات خبر و جست‌وجو با داده typed نمایشی build می‌شوند. اتصال
frontend به PostgreSQL/API و CMS تحریریه مرحله بعد است. ۹ تصویرسازی نمایشی
اختصاصی به‌صورت WebP محلی جایگزین تصویرهای remote قالب شده‌اند.

## 4. معماری فنی

```text
Browser
  ↓
Next.js Frontend
  ↓
NestJS REST API
  ↓
Prisma ORM
  ↓
PostgreSQL
```

- Monorepo با pnpm workspaces
- Frontend: Next.js، React، TypeScript، App Router
- Backend: NestJS، TypeScript، REST API نسخه‌بندی‌شده
- Database: PostgreSQL با Prisma ORM
- معماری Backend: Modular Monolith
- رابط: Persian-first و RTL
- فونت رابط: Vazirmatn Regular به‌صورت self-hosted WOFF2 از مسیر
  `apps/web/public/fonts/Vazirmatn-Regular.woff2`

## 5. دامنه داده

مدل‌های پایه:

- User
- Article
- Category
- Tag
- ArticleTag
- MediaAsset
- ArticleSource
- HomepagePlacement

وضعیت انتشار خبر:

```text
DRAFT
IN_REVIEW
SCHEDULED
PUBLISHED
ARCHIVED
```

## 6. تجربه عمومی

مسیرهای اولیه:

```text
/
/category/[slug]
/articles/[slug]
/search
```

صفحه اصلی شامل خبر اصلی، خبرهای منتخب، تازه‌ترین خبرها و بخش‌های موضوعی است.
نسخه موبایل تک‌ستونه است و Sidebar دسکتاپ را به جریان اصلی محتوا تبدیل می‌کند.

## 7. پنل تحریریه

در فاز بعدی:

- ورود مدیر، دبیر و نویسنده
- ایجاد و ویرایش خبر
- Draft، Review، Schedule و Publish
- مدیریت تصویر، alt و credit
- مدیریت دسته‌بندی و تگ
- پیش‌نمایش خبر
- چینش خبرهای منتخب صفحه اصلی

## 8. رسانه و SEO

- هر خبر باید slug، title، lead، body، cover image، alt، credit و publishedAt
  داشته باشد.
- صفحات خبر canonical، meta description، Open Graph و JSON-LD از نوع
  `NewsArticle` خواهند داشت.
- فایل‌های نمایشی می‌توانند در Git باشند؛ uploadهای runtime و فایل‌های خصوصی
  نباید commit شوند.
- تصویرهای نمونه قالب در `apps/web/public/images/articles/` محلی هستند و credit
  آن‌ها صریحاً تولید با هوش مصنوعی را اعلام می‌کند؛ این تصاویر سند رویداد واقعی
  محسوب نمی‌شوند.
- storage نهایی رسانه پیش از production باید از filesystem محلی جدا شود.

## 9. محدودیت‌های فعلی

- داده‌های قالب فعلاً نمایشی هستند.
- frontend عمومی هنوز داده را از API دریافت نمی‌کند.
- CMS و authentication هنوز پیاده‌سازی نشده‌اند.
- PostgreSQL محلی هنوز provision نشده است.
- سیاست editorial، source verification و correction policy نیاز به تأیید دارد.
- نام «هنرنامه» فعلاً نام نمایشی قالب است و برند نهایی محسوب نمی‌شود.

## 10. تست و Definition of Done فاز قالب

- صفحه اصلی، دسته‌بندی و خبر روی دسکتاپ و موبایل خوانا باشند.
- مسیرها build شوند و TypeScript بدون خطا باشد.
- ساختار semantic و metadata اولیه وجود داشته باشد.
- داده نمایشی از UI جدا باشد تا بعداً با API جایگزین شود.
- frontend به Prisma یا PostgreSQL دسترسی مستقیم نداشته باشد.

وضعیت فعلی: تمام موارد بالا برای قالب اولیه برقرارند؛ تأیید بصری کاربر باقی
مانده است.

## 11. Git و ایمنی

- branch فعلی `main` است.
- بدون درخواست صریح push انجام نمی‌شود.
- فایل‌های دقیق stage می‌شوند و از `git add .` استفاده نمی‌شود.
- env، credential، session و uploadهای runtime وارد Git نمی‌شوند.
- repository HotelYab فقط خوانده می‌شود.

## 12. قواعد به‌روزرسانی مستندات

### `PROJECT_CONTEXT.md`

برای تغییر وضعیت محصول، معماری اصلی، مدل داده، routeها، workflow تحریریه،
roadmap یا نحوه اجرا.

### `docs/ARCHITECTURE.md`

برای تغییر ساختار سیستم، boundary لایه‌ها، data flow یا استقرار.

### `docs/DECISIONS.md`

برای تصمیم فنی یا محصولی مهم جدید.

### `docs/API.md`

برای تغییر endpoint، query parameter، authentication یا response contract.

### `docs/DATABASE.md`

برای تغییر Prisma model، field، enum، index یا relation.

### `docs/DATA_POLICY.md`

برای تغییر قواعد منبع، راستی‌آزمایی، اصلاح، انتشار یا رسانه.

### `docs/CHANGELOG.md`

پس از هر تغییر مهم و تکمیل‌شده.

### `docs/TODO.md`

هنگام اضافه‌شدن، تکمیل‌شدن یا تغییر اولویت taskها.

## 13. Handoff

برای ادامه کار حداقل `PROJECT_CONTEXT.md` و سپس فایل تخصصی مرتبط از `docs/`
خوانده شود.
