# Art News

پروژه یک رسانه خبری فارسی و RTL با تمرکز بر سینما، تئاتر، تلویزیون و شبکه
نمایش خانگی است. این repository به‌صورت monorepo نگهداری می‌شود و در نسخه
نهایی شامل Next.js frontend، NestJS API، PostgreSQL و Prisma خواهد بود.

نام فعلی برند عمومی سایت «سینما نمایش» است؛ نام فنی repository همچنان
`Art-News` باقی می‌ماند.

## Current phase

فاز فعلی ساخت قالب نمایشی محصول با داده‌های نمونه است تا ساختار صفحه اصلی،
صفحه دسته‌بندی و صفحه خبر پیش از تکمیل CMS تأیید شوند.

## Applications

```text
apps/web   Next.js public website
apps/api   NestJS REST API
```

## Development

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm api:prisma:generate
pnpm web:dev
pnpm api:dev
```

Frontend به‌تنهایی با داده نمایشی اجرا می‌شود. اجرای API به PostgreSQL محلی و
`DATABASE_URL` معتبر نیاز دارد.

جزئیات کامل وضعیت و تصمیم‌های پروژه در `PROJECT_CONTEXT.md` و `docs/` قرار
دارند.
