# Art News Architecture

## Overview

Art News یک modular monolith با frontend و backend جدا در یک monorepo است.

```text
User / Browser
      ↓
Next.js Web
      ↓
NestJS REST API
      ↓
Prisma
      ↓
PostgreSQL
```

Frontend هیچ‌گاه مستقیم به database متصل نمی‌شود.

## Local Development Ports

- Next.js frontend به‌صورت پیش‌فرض روی `http://localhost:3001` اجرا می‌شود.
- NestJS API به‌صورت پیش‌فرض روی `http://localhost:4001` اجرا می‌شود.
- frontend درخواست‌های `/api/v1/*` را در محیط توسعه به
  `http://localhost:4001/api/v1/*` rewrite می‌کند.
- CORS پیش‌فرض API فقط origin محلی `http://localhost:3001` را می‌پذیرد.

## Repository Structure

```text
Art-News/
├── apps/
│   ├── web/
│   └── api/
├── docs/
├── packages/
├── PROJECT_CONTEXT.md
└── package.json
```

## Frontend

مسئولیت‌ها:

- rendering صفحات عمومی و پنل تحریریه؛
- metadata، canonical و structured data؛
- navigation و responsive layout؛
- فراخوانی API؛
- preview محتوای Draft برای کاربران مجاز.

Frontend نباید شامل Prisma query، PostgreSQL access یا publication rule اصلی
باشد.

رابط فارسی از `Vazirmatn-Regular.woff2` به‌صورت self-hosted استفاده می‌کند.
فونت با `@font-face` از `/fonts/Vazirmatn-Regular.woff2` بارگذاری می‌شود و
fallbackهای سیستمی فقط برای حالت خطای asset باقی می‌مانند.

صفحات عمومی تا جای ممکن Server Component باقی می‌مانند. ناوبری دسکتاپ به‌صورت
افقی در هدر قرار دارد و Drawer همبرگری فقط در اندازه‌های موبایل نمایش داده
می‌شود. کامپوننت ناوبری Client Component است تا مدیریت focus، قفل scroll و
بسته‌شدن Drawer با کلیک بیرون، Escape یا انتخاب لینک را انجام دهد. مهر اعتماد
رسانه نیز Client Component است چون script
رسمی ارائه‌دهنده را پس از mount بارگذاری و initialize می‌کند. بنر اکران نیوز و
Placeholder تبلیغات Componentهای مشترک و بدون داده runtime هستند.

آیتم‌های منوی قالب فعلی در آرایه ثابت `menuItems` تعریف شده‌اند و هنوز از CMS
دریافت نمی‌شوند. اسلایدر خبرهای مهم نیز Client Component است؛ داده Article را
از صفحه Server Component می‌گیرد و index جاری، کنترل جهت‌دار و Drag افقی با
Pointer Events را برای موس و لمس در مرورگر مدیریت می‌کند.

## Backend

مسئولیت‌ها:

- REST API نسخه‌بندی‌شده؛
- validation؛
- authentication و authorization؛
- editorial workflow؛
- publication و scheduling rules؛
- query و persistence از طریق Prisma.

ماژول‌های پیاده‌سازی‌شده اولیه:

```text
HealthModule
ArticlesModule
CategoriesModule
```

ماژول‌های برنامه‌ریزی‌شده:

```text
AuthModule
MediaModule
EditorialModule
HomepageModule
```

## Rendering Strategy

- صفحات عمومی با Server Components رندر می‌شوند.
- قالب اولیه از داده محلی typed استفاده می‌کند.
- routeهای فعلی `/`، `/category/[slug]`، `/articles/[slug]`، `/search`،
  `/english` و `/about` هستند.
- پس از اتصال API، homepage و category با cache کوتاه و on-demand
  revalidation خوانده می‌شوند.
- صفحه خبر metadata و JSON-LD اختصاصی تولید می‌کند.
- استفاده سراسری از `force-dynamic` انجام نمی‌شود مگر route واقعاً به آن نیاز
  داشته باشد.

## Media

- تصویرهای نمونه قالب به‌صورت WebP محلی در
  `apps/web/public/images/articles/` نگهداری می‌شوند تا preview به سرویس remote
  یا image proxy وابسته نباشد.
- uploadهای runtime در Git نگهداری نمی‌شوند.
- production به object storage/CDN نیاز دارد.
- alt و credit بخشی از domain model رسانه هستند.
- تصویرسازی تولیدشده با هوش مصنوعی باید در credit به‌صورت صریح مشخص شود و
  نباید به‌عنوان عکس مستند یک رویداد واقعی ارائه شود.
- کارت Open Graph برندشده در `apps/web/public/og.png` نگهداری می‌شود؛ صفحه
  هر خبر از تصویر اصلی خودش برای preview استفاده می‌کند.
- لوگوی رسمی هدر یک PNG محلی در
  `apps/web/public/logo-cinema-namayesh.png` است و از CSS نمایش داده می‌شود.
- دو تصویر خبری ارائه‌شده برای نمونه به‌ترتیب در
  `shootinga-cast-return.jpg` و `bot-leila-hatami-first-look.jpg` نگهداری
  می‌شوند؛ credit نهایی آن‌ها هنوز باید توسط تحریریه تکمیل شود.

## External Trust Seal

- لینک مستقیم مجوز به `https://e-rasaneh.ir/Certificate/101661` در فوتر وجود
  دارد تا حتی در صورت مسدودشدن JavaScript، مقصد رسمی قابل دسترسی باشد.
- `ERasanehTrustSeal` اسکریپت async رسمی
  `https://trustseal.e-rasaneh.ir/trustseal.js` را فقط در مرورگر و حداکثر یک‌بار
  بارگذاری می‌کند و شناسه گواهی `101661` را به آن می‌دهد.
- تنظیم CSP در production باید دامنه اسکریپت و منابع لازم مهر رسمی را به‌صورت
  محدود allowlist کند.

## Production Direction

نسخه اول می‌تواند روی یک VPS با Nginx، Next.js، NestJS و PostgreSQL اجرا شود.
application port و database port نباید عمومی باشند. Domain، HTTPS، backup،
monitoring و off-server media storage پیش از انتشار عمومی الزامی‌اند.
`cinemanamayesh.ir` دامنه canonical برنامه‌ریزی‌شده است و `ecrannews.ir` باید
پس از تنظیم DNS و SSL با redirect دائمی `301` به آن منتقل شود.

## Principles

1. Frontend و database از طریق API جدا می‌مانند.
2. publication rule در backend اجرا می‌شود.
3. UI عمومی بدون login قابل استفاده است.
4. قابلیت‌های جدید فقط بر اساس workflow واقعی تحریریه اضافه می‌شوند.
5. URLها پایدار، خوانا و SEO-friendly هستند.
