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
    slug: "visual-arts",
    title: "هنرهای تجسمی",
    description: "نقاشی، مجسمه، عکاسی و جریان‌های تازه هنر معاصر",
  },
  {
    slug: "cinema",
    title: "سینما",
    description: "فیلم، جشنواره، نقد و گفت‌وگو با سینماگران",
  },
  {
    slug: "music",
    title: "موسیقی",
    description: "آلبوم‌ها، اجراها و روایت‌های موسیقی امروز",
  },
  {
    slug: "literature",
    title: "ادبیات",
    description: "کتاب، شعر، داستان و جهان نویسندگان",
  },
  {
    slug: "theater",
    title: "تئاتر",
    description: "صحنه، نمایشنامه و تجربه‌های اجرایی",
  },
  {
    slug: "architecture-design",
    title: "معماری و طراحی",
    description: "فضا، شهر، طراحی و میراث معماری",
  },
];

const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<string, Category>;

export const articles: Article[] = [
  {
    slug: "new-generation-painters-shape-a-shared-studio",
    title: "وقتی کارگاه به یک شهر کوچک تبدیل می‌شود؛ روایت نسل تازه نقاشان",
    lead:
      "گروهی از هنرمندان جوان با تبدیل یک فضای صنعتی متروک به کارگاه مشترک، راه تازه‌ای برای تولید و نمایش آثارشان ساخته‌اند.",
    category: categoryBySlug["visual-arts"],
    imageUrl: "/images/articles/shared-painting-studio.webp",
    imageAlt: "هنرمندان جوان در کارگاه مشترک نقاشی",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-31T07:30:00.000Z",
    publishedLabel: "۹ شهریور ۱۴۰۵، ۱۱:۰۰",
    readingTime: "۶ دقیقه",
    author: "تحریریه هنرنامه",
    featured: true,
    body: [
      "این گزارش نمونه برای نمایش قالب سایت نوشته شده است. فضای کارگاهی مشترک، بهانه‌ای است برای دیدن این‌که چگونه همکاری می‌تواند مسیر تولید هنری را تغییر دهد.",
      "در این مدل، هر هنرمند فضای شخصی خود را دارد اما ابزارها، کتابخانه و سالن نمایش میان همه مشترک است. نتیجه فقط کاهش هزینه نیست؛ گفت‌وگویی روزانه شکل می‌گیرد که روی ایده‌ها و شیوه ارائه آثار اثر می‌گذارد.",
      "طراحی سایت نیز همین منطق را دنبال می‌کند: تصویر، تیتر و متن باید بدون ازدحام در کنار یکدیگر قرار بگیرند و خواننده بتواند از خبر اصلی به موضوعات مرتبط برسد.",
      "پس از تأیید قالب، این متن‌های نمایشی با محتوای واقعی تحریریه و داده‌های API جایگزین خواهند شد.",
    ],
  },
  {
    slug: "photography-exhibition-reads-the-city-at-night",
    title: "نمایشگاهی که شهر را از میان نورهای شبانه دوباره می‌خواند",
    lead:
      "یک مجموعه عکس تازه، مرز میان مستند شهری و تصویرسازی شاعرانه را بررسی می‌کند.",
    category: categoryBySlug["visual-arts"],
    imageUrl: "/images/articles/night-photography-exhibition.webp",
    imageAlt: "بازدیدکنندگان در نمایشگاه عکس‌های شبانه شهر",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-31T06:10:00.000Z",
    publishedLabel: "۹ شهریور ۱۴۰۵، ۹:۴۰",
    readingTime: "۴ دقیقه",
    author: "سارا نیک‌فر",
    body: [
      "این متن بخشی از محتوای نمونه قالب است و رویداد واقعی را گزارش نمی‌کند.",
      "صفحه خبر برای ترکیب عکس اصلی، توضیح کوتاه، بدنه خوانا و مطالب مرتبط طراحی شده است.",
    ],
  },
  {
    slug: "independent-cinema-finds-new-audience",
    title: "سینمای مستقل چگونه تماشاگر تازه خود را پیدا می‌کند؟",
    lead:
      "نمایش‌های کوچک و گفت‌وگوهای بعد از فیلم، رابطه متفاوتی میان فیلم‌ساز و مخاطب ساخته‌اند.",
    category: categoryBySlug["cinema"],
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
    slug: "a-concert-built-around-silence",
    title: "کنسرتی که سکوت را به بخشی از موسیقی تبدیل کرد",
    lead:
      "اجرایی مینیمال نشان می‌دهد فاصله میان صداها گاهی به‌اندازه خود نت‌ها اهمیت دارد.",
    category: categoryBySlug["music"],
    imageUrl: "/images/articles/concert-around-silence.webp",
    imageAlt: "نوازنده‌ای تنها در نور محدود صحنه",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-30T15:00:00.000Z",
    publishedLabel: "۸ شهریور ۱۴۰۵، ۱۸:۳۰",
    readingTime: "۵ دقیقه",
    author: "نیلوفر کیانی",
    body: [
      "این خبر نمونه است و برای نمایش نسبت تصویر، تیتر و متن در قالب خبری استفاده می‌شود.",
      "طراحی خلوت صفحه اجازه می‌دهد ریتم متن در کنار فضای سفید حفظ شود.",
    ],
  },
  {
    slug: "small-publishers-reimagine-the-book",
    title: "ناشران کوچک چگونه کتاب را دوباره طراحی می‌کنند",
    lead:
      "از انتخاب کاغذ تا تایپوگرافی، موج تازه نشر مستقل کتاب را به یک شیء هنری نزدیک کرده است.",
    category: categoryBySlug["literature"],
    imageUrl: "/images/articles/independent-publishers.webp",
    imageAlt: "میز کار صحافی با کتاب‌ها و نمونه‌های کاغذ",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-30T10:30:00.000Z",
    publishedLabel: "۸ شهریور ۱۴۰۵، ۱۴:۰۰",
    readingTime: "۵ دقیقه",
    author: "مریم پورآزاد",
    body: [
      "محتوای این صفحه نمایشی است و پس از راه‌اندازی CMS با خبر واقعی جایگزین می‌شود.",
      "کارت‌های سایت طوری طراحی شده‌اند که تیترهای کوتاه و بلند را بدون شکستن ریتم صفحه نمایش دهند.",
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
      "این متن برای نمایش انعطاف صفحه خبر در دسته‌های مختلف نوشته شده است.",
      "در فاز CMS، تحریریه می‌تواند تصویر، زیرنویس، تگ و مطالب مرتبط را مدیریت کند.",
    ],
  },
  {
    slug: "a-museum-designed-around-natural-light",
    title: "موزه‌ای که مسیر بازدید را با حرکت نور تنظیم می‌کند",
    lead:
      "معماران پروژه به‌جای ساخت سالن‌های یکسان، هر فضا را با کیفیت متفاوتی از نور تعریف کرده‌اند.",
    category: categoryBySlug["architecture-design"],
    imageUrl: "/images/articles/museum-natural-light.webp",
    imageAlt: "گالری مینیمال موزه زیر نورگیرهای سقفی",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-29T12:15:00.000Z",
    publishedLabel: "۷ شهریور ۱۴۰۵، ۱۵:۴۵",
    readingTime: "۴ دقیقه",
    author: "کاوه جهان‌بین",
    body: [
      "این روایت نمونه است و صرفاً برای نمایش قالب استفاده می‌شود.",
      "تصاویر عریض در دسکتاپ و نسبت فشرده‌تر در موبایل بدون کوچک‌کردن کل صفحه نمایش داده می‌شوند.",
    ],
  },
  {
    slug: "restoration-reveals-hidden-colors",
    title: "مرمت یک دیوارنگاره، رنگ‌هایی را آشکار کرد که دیده نمی‌شدند",
    lead:
      "بررسی لایه‌های زیرین اثر، مسیر متفاوتی از تصمیم‌های هنرمند را نشان می‌دهد.",
    category: categoryBySlug["visual-arts"],
    imageUrl: "/images/articles/restoration-hidden-colors.webp",
    imageAlt: "مرمت‌گران در حال آشکارکردن رنگ‌های یک دیوارنگاره",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-28T14:00:00.000Z",
    publishedLabel: "۶ شهریور ۱۴۰۵، ۱۷:۳۰",
    readingTime: "۳ دقیقه",
    author: "تحریریه هنرنامه",
    body: [
      "این خبر نمونه برای کامل‌کردن بخش تازه‌ترین خبرها در قالب ساخته شده است.",
      "رنگ‌ها، نسبت تصاویر و typography پس از دریافت هویت برند نهایی قابل تنظیم‌اند.",
    ],
  },
  {
    slug: "illustrators-build-a-visual-archive",
    title: "تصویرگران یک آرشیو بصری از اشیای روزمره می‌سازند",
    lead:
      "پروژه‌ای مشارکتی تلاش می‌کند طراحی و خاطره اشیای معمولی را پیش از ناپدیدشدن ثبت کند.",
    category: categoryBySlug["visual-arts"],
    imageUrl: "/images/articles/visual-archive-objects.webp",
    imageAlt: "طراحی اشیای روزمره روی میز مشترک تصویرگران",
    imageCredit: "تصویرسازی نمایشی تولیدشده با هوش مصنوعی",
    publishedAt: "2026-08-28T09:25:00.000Z",
    publishedLabel: "۶ شهریور ۱۴۰۵، ۱۲:۵۵",
    readingTime: "۴ دقیقه",
    author: "الهام رستگار",
    body: [
      "این محتوای نمایشی، شکل نهایی یک خبر کوتاه هنری را نشان می‌دهد.",
      "در نسخه واقعی، منبع و اطلاعات اصلاحات نیز به مدل داده اضافه می‌شوند.",
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
