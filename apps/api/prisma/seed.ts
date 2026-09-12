import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({ url: 'file:dev.db' })
const prisma = new PrismaClient({ adapter })

const categories = [
  { slug: "cinema", title: "سینما", description: "تازه‌ترین رویدادها، فیلم‌ها و چهره‌های سینمای ایران" },
  { slug: "news", title: "خبر", description: "خبرهای روز سینما، تولید، اکران و جشنواره‌ها" },
  { slug: "reviews-notes", title: "نقد و یادداشت", description: "نقد فیلم، تحلیل جریان‌ها و یادداشت‌های سینمایی" },
  { slug: "interviews", title: "گفت‌وگو", description: "گفت‌وگو با فیلم‌سازان، بازیگران و فعالان سینما" },
  { slug: "screenings", title: "نمایش", description: "اکران‌ها، برنامه‌های نمایش و رویدادهای ویژه فیلم" },
  { slug: "theater", title: "تئاتر", description: "خبر، نقد و گفت‌وگو از صحنه تئاتر" },
  { slug: "television", title: "تلویزیون", description: "سریال‌ها، برنامه‌ها و تازه‌های تلویزیون" },
  { slug: "home-video", title: "شبکه نمایش خانگی", description: "سریال‌ها و تولیدات پلتفرم‌های نمایش خانگی" },
  { slug: "world-cinema", title: "سینمای جهان", description: "فیلم‌ها، جشنواره‌ها و سینماگران جهان" },
  { slug: "photos", title: "عکس", description: "گزارش‌های تصویری، پشت صحنه و رویدادهای سینمایی" },
  { slug: "videos", title: "فیلم", description: "ویدیوها، تیزرها و گفت‌وگوهای تصویری" },
];

const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category])
);

const articles = [
  {
    slug: "fitileh-uncles-return-with-shootinga",
    title: "بعد از ۱۴ سال، بازگشت «عموهای فیتیله‌ای» با شوتینگا به سینما",
    lead: "علی فروتن، محمد مسلمی و حمید گلی پس از ۱۴ سال در فیلم سینمایی «شوتینگا» بار دیگر کنار یکدیگر قرار می‌گیرند.",
    category: categoryBySlug["news"],
    imageUrl: "/images/articles/shootinga-cast-return.jpg",
    imageAlt: "بازیگران فیلم شوتینگا سوار بر یک خودروی کلاسیک در جاده‌ای جنگلی",
    imageCredit: "تصویر ارائه‌شده برای نمونه؛ اعتبار نهایی در انتظار اعلام تحریریه",
    publishedAt: "2026-09-08T08:30:00.000Z",
    publishedLabel: "۱۷ شهریور ۱۴۰۵، ۱۲:۰۰",
    readingTime: "۲ دقیقه",
    author: "تحریریه سینما نمایش",
    featured: true,
    body: [
      "علی فروتن، محمد مسلمی و حمید گلی، چهره‌های محبوب و خاطره‌ساز چند نسل، پس از ۱۴ سال در فیلم سینمایی «شوتینگا» در کنار یکدیگر به سینما بازمی‌گردند.",
      "این فیلم به کارگردانی آرش معیریان و تهیه‌کنندگی امیر رحیم‌زاده ساخته می‌شود و ترکیب کامل بازیگران آن نیز به‌زودی معرفی خواهد شد.",
      "محمد مسلمی نویسندگی «شوتینگا» را بر عهده دارد و این فیلم محصول بنیاد سینمایی فارابی است.",
    ],
  },
  {
    slug: "first-look-leila-hatami-in-bot",
    title: "رونمایی از نخستین تصویر لیلا حاتمی در «بُت»",
    lead: "هم‌زمان با اعلام زمان اکران فیلم «بُت»، نخستین تصویر از تازه‌ترین ساخته حمید نعمت‌الله منتشر شد.",
    category: categoryBySlug["news"],
    imageUrl: "/images/articles/bot-leila-hatami-first-look.jpg",
    imageAlt: "لیلا حاتمی با تاج و پوشش آبی در نمایی از فیلم بُت",
    imageCredit: "تصویر ارائه‌شده برای نمونه؛ اعتبار نهایی در انتظار اعلام تحریریه",
    publishedAt: "2026-09-08T07:45:00.000Z",
    publishedLabel: "۱۷ شهریور ۱۴۰۵، ۱۱:۱۵",
    readingTime: "۲ دقیقه",
    author: "تحریریه سینما نمایش",
    featured: true,
    body: [
      "با اعلام زمان اکران فیلم «بُت»، نخستین تصویر از تازه‌ترین ساخته حمید نعمت‌الله منتشر شد. این فیلم به تهیه‌کنندگی و کارگردانی حمید نعمت‌الله و با پخش فیلمیران، از اوایل پاییز روی پرده سینماها می‌رود.",
      "آخرین ساخته نعمت‌الله، «قاتل و وحشی»، پس از هفت سال همچنان در توقیف است.",
      "لیلا حاتمی، محمدرضا فروتن، لیلی رشیدی، کاظم سیاحی، ایمان صیادبرهانی، الناز حبیبی، بانیپال شومون، الهام جسمانی، مهتاب ثروتی و نوید پورفرج بازیگران «بُت» هستند.",
    ],
  },
  {
    slug: "first-look-new-film-production-workshop",
    title: "اولین تصاویر از کارگاه تولید فیلم تازه منتشر شد",
    lead: "گروه طراحی صحنه یک فضای صنعتی قدیمی را برای فیلم‌برداری تازه‌ترین پروژه خود بازسازی کرده است.",
    category: categoryBySlug["news"],
    imageUrl: "/images/articles/shared-painting-studio.webp",
    imageAlt: "اعضای گروه طراحی صحنه در یک کارگاه تولید فیلم",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-31T07:30:00.000Z",
    publishedLabel: "۹ شهریور ۱۴۰۵، ۱۱:۰۰",
    readingTime: "۶ دقیقه",
    author: "تحریریه سینما نمایش",
    featured: true,
    body: [
      "این خبر برای نمایش قالب اولیه رسانه سینمایی نوشته شده و به رویداد واقعی اشاره نمی‌کند.",
      "در این پروژه فرضی، گروه طراحی صحنه چند هفته پیش از آغاز فیلم‌برداری ساخت دکورها و آزمون رنگ را شروع کرده است.",
      "ساختار صفحه خبر طوری طراحی شده که تصویر اصلی، تیتر، لید و اطلاعات انتشار بدون ازدحام در اختیار مخاطب موبایل قرار بگیرند.",
      "پس از تأیید قالب، این متن‌های نمایشی با محتوای واقعی تحریریه و داده‌های API جایگزین خواهند شد.",
    ],
  },
  {
    slug: "city-nights-through-cinema-lens",
    title: "شب‌های شهر در قاب سینما؛ گزارشی تصویری از لوکیشن‌های تازه",
    lead: "این مجموعه عکس به سراغ خیابان‌هایی رفته که در فیلم‌های تازه نقش مهمی پیدا کرده‌اند.",
    category: categoryBySlug["photos"],
    imageUrl: "/images/articles/night-photography-exhibition.webp",
    imageAlt: "نمایش عکس‌های شبانه شهر در یک گالری",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-31T06:10:00.000Z",
    publishedLabel: "۹ شهریور ۱۴۰۵، ۹:۴۰",
    readingTime: "۴ دقیقه",
    author: "سارا نیک‌فر",
    body: [
      "این متن بخشی از محتوای نمونه قالب است و رویداد واقعی را گزارش نمی‌کند.",
      "بخش عکس برای گزارش‌های تصویری، پشت صحنه و مجموعه‌های مرتبط با سینما در نظر گرفته شده است.",
    ],
  },
  {
    slug: "independent-cinema-finds-new-audience",
    title: "سینمای مستقل چگونه تماشاگر تازه خود را پیدا می‌کند؟",
    lead: "نمایش‌های کوچک و گفت‌وگوهای بعد از فیلم، رابطه متفاوتی میان فیلم‌ساز و مخاطب ساخته‌اند.",
    category: categoryBySlug["world-cinema"],
    imageUrl: "/images/articles/independent-cinema.webp",
    imageAlt: "نمایش فیلم و گفت‌وگو در یک سینمای مستقل",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-30T18:20:00.000Z",
    publishedLabel: "۸ شهریور ۱۴۰۵، ۲۱:۵۰",
    readingTime: "۷ دقیقه",
    author: "امیر رهگذر",
    body: [
      "این مقاله نمونه برای ارزیابی ساختار صفحه دسته‌بندی و جزئیات خبر است.",
      "در نسخه نهایی، داده‌های نویسنده، زمان انتشار و مطالب مرتبط از API دریافت می‌شوند.",
    ],
  },
  {
    slug: "video-minimal-performance-built-around-silence",
    title: "ویدیوی یک اجرای مینیمال؛ وقتی سکوت بخشی از روایت می‌شود",
    lead: "بخش‌هایی از یک اجرای تصویری تازه، رابطه میان موسیقی، بازی و سکوت را تجربه می‌کند.",
    category: categoryBySlug["videos"],
    imageUrl: "/images/articles/concert-around-silence.webp",
    imageAlt: "نوازنده‌ای تنها در نور محدود صحنه",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-30T15:00:00.000Z",
    publishedLabel: "۸ شهریور ۱۴۰۵، ۱۸:۳۰",
    readingTime: "۵ دقیقه",
    author: "نیلوفر کیانی",
    body: [
      "این مطلب نمونه است و برای نمایش نحوه معرفی ویدیوها در قالب رسانه استفاده می‌شود.",
      "در نسخه نهایی ویدیوهای سنگین در صفحه اصلی بارگذاری نمی‌شوند و کاربر از طریق تصویر و لینک به مقصد ویدیو هدایت خواهد شد.",
    ],
  },
  {
    slug: "production-notebooks-reveal-film-language",
    title: "دفترهای تولید چه چیزی درباره زبان یک فیلم به ما می‌گویند؟",
    lead: "از طراحی لباس تا یادداشت‌های صحنه، جزئیات پیش‌تولید مسیر بصری فیلم را شکل می‌دهند.",
    category: categoryBySlug["reviews-notes"],
    imageUrl: "/images/articles/independent-publishers.webp",
    imageAlt: "میز کار صحافی با کتاب‌ها و نمونه‌های کاغذ",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-30T10:30:00.000Z",
    publishedLabel: "۸ شهریور ۱۴۰۵، ۱۴:۰۰",
    readingTime: "۵ دقیقه",
    author: "مریم پورآزاد",
    body: [
      "این یادداشت نمایشی است و پس از راه‌اندازی CMS با محتوای واقعی تحریریه جایگزین می‌شود.",
      "بخش نقد و یادداشت برای متن‌های تحلیلی و روایت‌هایی در نظر گرفته شده که فراتر از خبر روز هستند.",
    ],
  },
  {
    slug: "theater-returns-to-an-abandoned-house",
    title: "بازگشت تئاتر به خانه‌ای که سال‌ها خالی مانده بود",
    lead: "یک گروه نمایشی، معماری خانه را به بخشی از روایت و حرکت بازیگران تبدیل کرده است.",
    category: categoryBySlug["theater"],
    imageUrl: "/images/articles/theater-abandoned-house.webp",
    imageAlt: "اجرای تئاتر در اتاق‌های یک خانه قدیمی",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-29T17:40:00.000Z",
    publishedLabel: "۷ شهریور ۱۴۰۵، ۲۱:۱۰",
    readingTime: "۶ دقیقه",
    author: "پویان مرادی",
    body: [
      "این متن نمایشی برای نشان‌دادن قالب خبرهای تئاتر نوشته شده است.",
      "در فاز CMS، تحریریه می‌تواند تصویر، زیرنویس، تگ و مطالب مرتبط را مدیریت کند.",
    ],
  },
  {
    slug: "television-set-designed-around-natural-light",
    title: "طراحی صحنه یک سریال تازه با نور طبیعی شکل گرفت",
    lead: "سازندگان این مجموعه تلویزیونی به‌جای نورپردازی سنگین، معماری صحنه را با حرکت نور هماهنگ کرده‌اند.",
    category: categoryBySlug["television"],
    imageUrl: "/images/articles/museum-natural-light.webp",
    imageAlt: "فضای مینیمال یک صحنه تلویزیونی زیر نورگیرهای سقفی",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-29T12:15:00.000Z",
    publishedLabel: "۷ شهریور ۱۴۰۵، ۱۵:۴۵",
    readingTime: "۴ دقیقه",
    author: "کاوه جهان‌بین",
    body: [
      "این روایت نمونه است و صرفاً برای نمایش بخش تلویزیون استفاده می‌شود.",
      "تصاویر عریض در دسکتاپ و نسبت فشرده‌تر در موبایل بدون کوچک‌کردن کل صفحه نمایش داده می‌شوند.",
    ],
  },
  {
    slug: "restored-classic-reaches-home-video",
    title: "نسخه مرمت‌شده یک اثر کلاسیک به شبکه نمایش خانگی می‌رسد",
    lead: "بازسازی رنگ و صدای این فیلم قدیمی پس از چند ماه کار برای نمایش آنلاین آماده شده است.",
    category: categoryBySlug["home-video"],
    imageUrl: "/images/articles/restoration-hidden-colors.webp",
    imageAlt: "متخصصان در حال بررسی رنگ‌های یک اثر قدیمی",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-28T14:00:00.000Z",
    publishedLabel: "۶ شهریور ۱۴۰۵، ۱۷:۳۰",
    readingTime: "۳ دقیقه",
    author: "تحریریه سینما نمایش",
    body: [
      "این خبر نمونه برای نمایش محتوای شبکه نمایش خانگی در قالب ساخته شده است.",
      "در نسخه واقعی، اطلاعات پلتفرم، زمان انتشار و منبع رسمی خبر ثبت می‌شوند.",
    ],
  },
  {
    slug: "storyboard-artists-build-visual-archive",
    title: "گفت‌وگو با طراحانی که آرشیو استوری‌بورد می‌سازند",
    lead: "این گروه تلاش می‌کند طرح‌های اولیه صحنه‌ها و اشیای سینمایی را برای پژوهشگران آینده حفظ کند.",
    category: categoryBySlug["interviews"],
    imageUrl: "/images/articles/visual-archive-objects.webp",
    imageAlt: "طراحی اشیای صحنه روی میز مشترک طراحان استوری‌بورد",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-28T09:25:00.000Z",
    publishedLabel: "۶ شهریور ۱۴۰۵، ۱۲:۵۵",
    readingTime: "۴ دقیقه",
    author: "الهام رستگار",
    body: [
      "این گفت‌وگوی نمایشی، شکل اولیه صفحه مصاحبه در رسانه را نشان می‌دهد.",
      "در نسخه واقعی، متن کامل گفت‌وگو، نام عکاس، منبع و اطلاعات اصلاحات نیز ثبت می‌شوند.",
    ],
  },
];

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cinemanamayesh.ir' },
    update: {},
    create: {
      email: 'admin@cinemanamayesh.ir',
      username: 'admin',
      displayName: 'تحریریه سینما نمایش',
      passwordHash: 'dummyhash',
      role: 'ADMIN',
    },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        title: cat.title,
        description: cat.description,
        sortOrder: 0,
      },
    });
  }

  let i = 0;
  for (const art of articles) {
    const category = await prisma.category.findUnique({
      where: { slug: art.category.slug }
    });

    const coverImage = await prisma.mediaAsset.create({
      data: {
        url: art.imageUrl,
        mimeType: 'image/jpeg',
        alt: art.imageAlt || '',
        credit: art.imageCredit || '',
        kind: 'IMAGE',
      }
    });

    const createdArticle = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        slug: art.slug,
        title: art.title,
        lead: art.lead,
        body: art.body.join('\n\n'),
        status: 'PUBLISHED',
        publishedAt: new Date(art.publishedAt),
        authorId: adminUser.id,
        categoryId: category!.id,
        coverImageId: coverImage.id,
      },
    });

    if (art.featured) {
      await prisma.homepagePlacement.create({
        data: {
          articleId: createdArticle.id,
          slot: 'LEAD',
          displayOrder: i++,
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
