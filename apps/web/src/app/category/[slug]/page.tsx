import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdvertisementPlaceholder,
  EcranNewsPromo,
} from "@/components/promotion-blocks";
import { fetchArticles, fetchCategoryBySlug } from "@/lib/api";
import type { Article } from "@/lib/news";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const cinemaCategorySlugs = [
  "cinema",
  "news",
  "reviews-notes",
  "interviews",
  "report",
];

async function fetchCategoryArticles(slug: string): Promise<Article[]> {
  const slugs = slug === "cinema" ? cinemaCategorySlugs : [slug];
  const articleGroups = await Promise.all(
    slugs.map((category) => fetchArticles({ category, pageSize: 15 })),
  );
  const uniqueArticles = new Map<string, Article>();

  articleGroups.flat().forEach((article) => {
    uniqueArticles.set(article.slug, article);
  });

  return Array.from(uniqueArticles.values())
    .sort(
      (first, second) =>
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime(),
    )
    .slice(0, 15);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  let category = await fetchCategoryBySlug(slug);

  if (!category && slug === "report") {
    category = { slug: "report", title: "گزارش", description: "گزارش‌ها، برنامه‌های نمایش و رویدادهای ویژه فیلم" };
  }

  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category = await fetchCategoryBySlug(slug);

  if (!category && slug === "report") {
    category = { slug: "report", title: "گزارش", description: "گزارش‌ها، برنامه‌های نمایش و رویدادهای ویژه فیلم" };
  }

  if (!category) notFound();

  let categoryArticles = await fetchCategoryArticles(slug);
  
  if (slug === "report") {
    categoryArticles = [
      {
        slug: "dummy-report",
        title: "گزارشی از پردیس سینمایی ملت",
        lead: "پوشش ویژه اخبار و حواشی پردیس سینمایی",
        category,
        imageUrl: "/images/articles/night-photography-exhibition.webp",
        imageAlt: "",
        imageCredit: "",
        publishedAt: new Date().toISOString(),
        publishedLabel: "امروز",
        readingTime: "۳ دقیقه",
        author: "سینما نمایش",
        body: [],
      }
    ];
  }

  const hasArticles = categoryArticles.length > 0;

  return (
    <main className="container pt-6 md:pt-10 pb-12">
      <header>
        <h1 className="!mt-8 md:!mt-12 !mb-8 md:!mb-10 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">{category.title}</h1>
        <hr className="border-t-[3px] border-slate-900 mt-4 mb-6" />
      </header>

      {hasArticles ? (
        <section className="flex flex-col gap-6 mt-6" aria-label={`خبرهای ${category.title}`}>
          {categoryArticles.map((article) => {
            const excerpt = article.lead || (article.body && article.body.length > 0 ? article.body[0] : "");
            return (
              <article key={article.slug} className="group flex gap-4 items-center">
                <Link
                  href={`/articles/${article.slug}`}
                  className="block overflow-hidden rounded-xl shrink-0 w-32 md:w-48 aspect-[3/2] relative"
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 760px) 30vw, 200px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-900 font-extrabold group-hover:text-orange-600 transition-colors duration-300 text-base md:text-lg line-clamp-2">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-slate-700 text-sm line-clamp-2 mt-2">
                    {excerpt}
                  </p>
                  <div className="text-slate-500 text-xs font-medium mt-3 flex items-center gap-1">
                    <span>{article.publishedLabel}</span>
                    <span className="mx-1">&bull;</span>
                    <span>{article.readingTime}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="category-empty" aria-live="polite">
          <span>آرشیو این بخش به‌زودی تکمیل می‌شود</span>
          <h2>هنوز خبری در «{category.title}» منتشر نشده است.</h2>
          <p>به‌محض انتشار اولین مطلب، همین صفحه بدون تغییر آدرس به‌روز می‌شود.</p>
          <Link href="/">بازگشت به صفحه نخست</Link>
        </section>
      )}

      <section className="promotion-stack category-promotions">
        <EcranNewsPromo />
        <AdvertisementPlaceholder label="تبلیغات این بخش" />
      </section>
    </main>
  );
}
