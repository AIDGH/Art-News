export type Category = {
  slug: string;
  title: string;
  description: string;
};

export type Article = {
  slug: string;
  title: string;
  lead: string;
  category: Category;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  publishedAt: string;
  publishedLabel: string;
  readingTime: string;
  author: string;
  featured?: boolean;
  body: string[];
};

export const categories: Category[] = [
  {
    slug: "cinema",
    title: "سینما",
    description: "تازه‌ترین رویدادها، فیلم‌ها و چهره‌های سینمای ایران",
  },
  {
    slug: "news",
    title: "خبر",
    description: "خبرهای روز سینما، تولید، اکران و جشنواره‌ها",
  },
  {
    slug: "reviews-notes",
    title: "نقد و یادداشت",
    description: "نقد فیلم، تحلیل جریان‌ها و یادداشت‌های سینمایی",
  },
  {
    slug: "interviews",
    title: "گفت‌وگو",
    description: "گفت‌وگو با فیلم‌سازان، بازیگران و فعالان سینما",
  },
  {
    slug: "screenings",
    title: "نمایش",
    description: "اکران‌ها، برنامه‌های نمایش و رویدادهای ویژه فیلم",
  },
  {
    slug: "theater",
    title: "تئاتر",
    description: "خبر، نقد و گفت‌وگو از صحنه تئاتر",
  },
  {
    slug: "television",
    title: "تلویزیون",
    description: "سریال‌ها، برنامه‌ها و تازه‌های تلویزیون",
  },
  {
    slug: "home-video",
    title: "شبکه نمایش خانگی",
    description: "سریال‌ها و تولیدات پلتفرم‌های نمایش خانگی",
  },
  {
    slug: "world-cinema",
    title: "سینمای جهان",
    description: "فیلم‌ها، جشنواره‌ها و سینماگران جهان",
  },
  {
    slug: "photos",
    title: "عکس",
    description: "گزارش‌های تصویری، پشت صحنه و رویدادهای سینمایی",
  },
  {
    slug: "videos",
    title: "فیلم",
    description: "ویدیوها، تیزرها و گفت‌وگوهای تصویری",
  },
];

const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<string, Category>;

export const articles: Article[] = [
  {
    slug: "first-look-new-film-production-workshop",
    title: "اولین تصاویر از کارگاه تولید فیلم تازه منتشر شد",
    lead:
      "گروه طراحی صحنه یک فضای صنعتی قدیمی را برای فیلم‌برداری تازه‌ترین پروژه خود بازسازی کرده است.",
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
    lead:
      "این مجموعه عکس به سراغ خیابان‌هایی رفته که در فیلم‌های تازه نقش مهمی پیدا کرده‌اند.",
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
    lead:
      "نمایش‌های کوچک و گفت‌وگوهای بعد از فیلم، رابطه متفاوتی میان فیلم‌ساز و مخاطب ساخته‌اند.",
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
    lead:
      "بخش‌هایی از یک اجرای تصویری تازه، رابطه میان موسیقی، بازی و سکوت را تجربه می‌کند.",
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
    lead:
      "از طراحی لباس تا یادداشت‌های صحنه، جزئیات پیش‌تولید مسیر بصری فیلم را شکل می‌دهند.",
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
    lead:
      "یک گروه نمایشی، معماری خانه را به بخشی از روایت و حرکت بازیگران تبدیل کرده است.",
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
    lead:
      "سازندگان این مجموعه تلویزیونی به‌جای نورپردازی سنگین، معماری صحنه را با حرکت نور هماهنگ کرده‌اند.",
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
    lead:
      "بازسازی رنگ و صدای این فیلم قدیمی پس از چند ماه کار برای نمایش آنلاین آماده شده است.",
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
    lead:
      "این گروه تلاش می‌کند طرح‌های اولیه صحنه‌ها و اشیای سینمایی را برای پژوهشگران آینده حفظ کند.",
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

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryArticles(slug: string): Article[] {
  return articles.filter((article) => article.category.slug === slug);
}
