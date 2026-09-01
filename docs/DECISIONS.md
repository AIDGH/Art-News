# Art News Decisions

## 1. Use a pnpm Monorepo

Frontend و backend در یک repository اما در applicationهای مستقل نگهداری
می‌شوند. این ساختار تجربه موفق HotelYab را بدون انتقال domain آن حفظ می‌کند.

## 2. Use Next.js for the Public Website

SEO، Server Components، metadata API و routeهای محتوایی دلایل اصلی انتخاب
Next.js هستند.

## 3. Use a Separate NestJS REST API

workflow انتشار، authentication و database logic از UI جدا می‌مانند. REST برای
MVP ساده‌تر از GraphQL است و قرارداد آن با Swagger مستند می‌شود.

## 4. Use PostgreSQL and Prisma

Article، Category، Tag، Media و editorial relations ساختار رابطه‌ای دارند.
PostgreSQL منبع اصلی داده و Prisma لایه دسترسی database است.

## 5. Start as a Modular Monolith

Microservice، Redis و queue تا زمانی که scheduling یا traffic واقعی ضرورت آن
را نشان نداده‌اند اضافه نمی‌شوند.

## 6. Public Reading Does Not Require an Account

Authentication فقط برای newsroom و عملیات مدیریتی لازم است. حساب مخاطب جزو
MVP نیست.

## 7. Approve the Editorial Template Before Completing the CMS

صفحه اصلی، دسته‌بندی و خبر ابتدا با داده typed نمایشی ساخته می‌شوند. پس از
تأیید ظاهر، API و CMS به همان componentها متصل خواهند شد.

## 8. Use a Real Mobile Layout

موبایل نسخه کوچک‌شده desktop نیست. layout تک‌ستونه، navigation جمع‌شونده و
ترتیب محتوای اختصاصی دارد.

## 9. Keep Media Metadata in the Domain

alt، credit، caption، dimensions و focal point مستقل از URL فایل ذخیره می‌شوند.
فایل production بعداً در object storage قرار می‌گیرد.

## 10. Optimize for News SEO

صفحات خبر canonical، metadata اختصاصی، Open Graph و `NewsArticle` JSON-LD
دارند. cache بعد از publish با revalidation کنترل می‌شود.

## 11. Self-Host Vazirmatn as WOFF2

رابط فارسی از فایل WOFF2 محلی Vazirmatn استفاده می‌کند تا typography در همه
صفحات یکسان باشد، وابستگی runtime به font CDN وجود نداشته باشد و نمایش متن با
`font-display: swap` کنترل شود.
