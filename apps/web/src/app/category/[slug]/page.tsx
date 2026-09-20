import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
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
  "screenings",
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
  const category = await fetchCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) notFound();

  const categoryArticles = await fetchCategoryArticles(slug);
  const [lead, ...rest] = categoryArticles;

  return (
    <main className="category-page container">
      <header className="category-hero">
        <h1>{category.title}</h1>
      </header>

      {lead ? (
        <>
          <article className="category-lead">
            <Link className="category-lead-image" href={`/articles/${lead.slug}`}>
              <Image
                src={lead.imageUrl}
                alt={lead.imageAlt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 62vw"
              />
            </Link>
            <div>
              <h2>
                <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
              </h2>
              <p>{lead.lead}</p>
              <div className="article-meta">
                <span>{lead.publishedLabel}</span>
                <span>{lead.readingTime}</span>
              </div>
            </div>
          </article>

          <section className="category-list" aria-label={`خبرهای ${category.title}`}>
            {rest.map((article) => (
              <ArticleCard article={article} variant="horizontal" key={article.slug} excerptClassName="!line-clamp-2 text-sm text-gray-600 dark:text-gray-400 mt-2" />
            ))}
          </section>
        </>
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
