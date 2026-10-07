import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdvertisementPlaceholder } from "@/components/promotion-blocks";
import { fetchArticles, fetchCategoryBySlug, fetchMediaPosts } from "@/lib/api";
import { MediaGallery } from "@/components/media-gallery";
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
  "screenings",
];

async function fetchCategoryArticles(slug: string): Promise<Article[]> {
  const slugs = slug === "cinema" ? cinemaCategorySlugs : slug === "report" ? ["report", "screenings"] : [slug];
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

  const categoryArticles = await fetchCategoryArticles(slug);

  const hasArticles = categoryArticles.length > 0;
  const mediaKind = slug === "photos" ? "PHOTOS" : slug === "videos" ? "VIDEOS" : null;
  const mediaPosts = mediaKind ? await fetchMediaPosts(mediaKind) : null;

  return (
    <main className="container pt-6 md:pt-10 pb-12">
      <header className="!mt-8 md:!mt-12 !mb-8 md:!mb-10">
        <div className="section-heading">
          <div>
            <h1>{category.title}</h1>
          </div>
        </div>
      </header>

      {mediaKind && mediaPosts ? <MediaGallery key={mediaKind} kind={mediaKind} initial={mediaPosts.page} failed={mediaPosts.failed} /> : null}

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
                    unoptimized={article.imageUrl.startsWith("/uploads/")}
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
      ) : !mediaKind ? (
        <section className="category-empty" aria-live="polite">
          <span>آرشیو این بخش به‌زودی تکمیل می‌شود</span>
          <h2>هنوز خبری در «{category.title}» منتشر نشده است.</h2>
          <p>به‌محض انتشار اولین مطلب، همین صفحه بدون تغییر آدرس به‌روز می‌شود.</p>
          <Link href="/">بازگشت به صفحه نخست</Link>
        </section>
      ) : null}

      <section className="promotion-stack category-promotions">
        <AdvertisementPlaceholder label="تبلیغات این بخش" placement="CATEGORY" />
      </section>
    </main>
  );
}
