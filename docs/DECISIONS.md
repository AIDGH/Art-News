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

## 12. Use “سینما نمایش” as the Public Brand Name

نام قابل‌نمایش در رابط، metadata، structured data و کارت اشتراک‌گذاری «سینما
نمایش» است. برای جلوگیری از تغییر بی‌دلیل مسیرها و ابزارهای توسعه، نام فنی
repository و packageها فعلاً `Art-News` باقی می‌ماند.

## 13. Use a Shared Hamburger Navigation on Mobile and Desktop

منوی اصلی در همه اندازه‌های صفحه به‌صورت همبرگری ارائه می‌شود تا ساختار
Mobile-first یکسان بماند. زیرمنوی سینما شامل خبر، نقد و یادداشت، گفت‌وگو و
نمایش است و drawer با کلیک بیرون، Escape و انتخاب لینک بسته می‌شود.

## 14. Present Ecran News as a Promotional Placement

«سینما نمایش» تنها برند هدر است. اکران نیوز به‌صورت بنر معرفی/تبلیغ مشترک در
صفحه اصلی و صفحات محتوایی نمایش داده می‌شود تا با هویت رسمی سایت اشتباه نشود.
تا زمان دریافت لوگو و URL رسمی، این بخش Placeholder باقی می‌ماند.

## 15. Use the Approved Cinema Namayesh Logo as a Local Asset

لوگوی تأییدشده «سینما نمایش» به‌صورت PNG محلی در public نگهداری و از CSS هدر
نمایش داده می‌شود. این انتخاب هدر را از CDN یا سرویس تصویری خارجی مستقل نگه
می‌دارد و لوگو همچنان به صفحه اصلی لینک است.

## 16. Use the Official E-Rasaneh Trust Seal Integration

فوتر هم لینک مستقیم گواهی `101661` و هم مهر رسمی ارائه‌دهنده را نمایش می‌دهد.
اسکریپت مهر فقط در Client Component و به‌صورت async بارگذاری می‌شود تا rendering
سمت سرور و محتوای اصلی صفحه به سرویس خارجی وابسته نباشند.

## 17. Reserve Ports 3001 and 4001 for Local Development

فرانت در اجرای development و production محلی به‌صورت پیش‌فرض از پورت `3001`
استفاده می‌کند و API روی `4001` گوش می‌دهد. CORS، rewrite داخلی، metadata base
و فایل‌های env نمونه با همین قرارداد هماهنگ نگه داشته می‌شوند.
