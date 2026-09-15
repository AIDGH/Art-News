# Art News

پروژه یک رسانه خبری فارسی و RTL با تمرکز بر سینما، تئاتر، تلویزیون و شبکه
نمایش خانگی است. این repository به‌صورت monorepo نگهداری می‌شود و در نسخه
فعلی شامل Next.js frontend، NestJS API، SQLite و Prisma است.

نام فعلی برند عمومی سایت «سینما نمایش» است؛ نام فنی repository همچنان
`Art-News` باقی می‌ماند.

لوگوی رسمی برند به‌صورت asset محلی در هدر استفاده می‌شود و فوتر نسخه فعلی به
صفحه مجوز و مهر رسمی پایگاه خبری در سامانه رسانه متصل است.

## Current phase

فاز فعلی شامل سایت عمومی متصل به API و MVP پنل سینما نمایش برای ثبت و انتشار خبر است.

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
ADMIN_SEED_PASSWORD="یک-رمز-حداقل-هشت-کاراکتری" pnpm --filter @art-news/api exec tsx prisma/seed.ts
pnpm web:dev
pnpm api:dev
```

SQLite محلی با `DATABASE_URL=file:dev.db` اجرا می‌شود. رمز seed در Git ذخیره
نمی‌شود و باید هنگام اجرای seed تعیین شود. پنل در `http://localhost:3001/admin`
در دسترس است.

آدرس‌های پیش‌فرض محیط توسعه:

```text
Frontend: http://localhost:3001
API:      http://localhost:4001/api/v1
Swagger:  http://localhost:4001/docs
```

جزئیات کامل وضعیت و تصمیم‌های پروژه در `PROJECT_CONTEXT.md` و `docs/` قرار
دارند.

## Production

استقرار فعلی برای یک ابرک Ubuntu 24.04 با Nginx، سرویس‌های systemd و releaseهای
جداگانه طراحی شده است. سرور تقریباً هر یک دقیقه شاخه `main` را بررسی می‌کند و
در صورت وجود commit جدید، migration و build و restart را خودکار انجام می‌دهد.
راهنمای عملیات، مسیر داده‌های پایدار و بکاپ در `docs/DEPLOYMENT.md` ثبت شده‌اند.
