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
pnpm --filter @art-news/api exec prisma migrate deploy
ADMIN_SEED_PASSWORD="یک-رمز-حداقل-هشت-کاراکتری" pnpm --filter @art-news/api exec tsx prisma/seed.ts
pnpm web:dev
pnpm api:dev
```

SQLite محلی با `DATABASE_URL=file:dev.db` اجرا می‌شود. رمز seed در Git ذخیره
نمی‌شود و باید هنگام اجرای seed تعیین شود. پنل در `http://localhost:3001/admin`
در دسترس است.

در پروژه موجود پس از pull، generate و migrate deploy را اجرا کنید؛ seed فقط برای
راه‌اندازی اولیه است و اجرای دوباره آن ممکن است خبرهای نمونه یا رمز مدیر را تغییر دهد.
پیش از migration دیتابیس موجود، بکاپ بگیرید و از reset یا پاک‌کردن دیتابیس استفاده نکنید.

### امکانات محتوای پنل

- «عکس و ویدیو» در `/admin/media-posts`: عنوان، توضیح و لینک پست اصلی اختیاری، کاور، ۱ تا ۷ فایل
  مرتب، پیش‌نویس/انتشار/بایگانی و حذف. محتوا در بخش عکس/فیلم به شکل گرید و ریلز
  دیده می‌شود. عکس تا ۸ MiB و MP4/WebM تا ۳۰ MiB. پیش از اجرا migration جدید را
  با `prisma migrate deploy` اعمال کنید؛ دیتابیس موجود را reset یا reseed نکنید.

- «تبلیغات»: انتخاب تصویر/گیف/ویدیوی MP4 یا WebM، لینک و نوشته اختیاری، شروع و
  پایان نمایش و جایگاه (صفحه اصلی/خبر/دسته‌بندی/همه). فهرست قابل فیلتر و هر تبلیغ
  قابل ویرایش، توقف، فعال‌سازی مجدد و حذف است. تصویر تا ۸ MiB و ویدیو تا ۳۰ MiB.
- در فرم خبر، «ادامهٔ مطلب» پس از تصویر اصلی امکان افزودن متن و گروه عکس دارد؛
  بخش‌ها قابل جابه‌جایی و هر گروه شامل ۱ تا ۷ عکس است. نمایش عمومی ابتدا تصویر
  اصلی و متن اصلی، سپس همین بخش‌ها به ترتیب ثبت‌شده است.

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
