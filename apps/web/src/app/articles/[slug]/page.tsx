import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ArticleEngagement } from "@/components/article-engagement";
import {
  AdvertisementPlaceholder,
  EcranNewsPromo,
} from "@/components/promotion-blocks";
import { SectionHeading } from "@/components/section-heading";
import { fetchArticleBySlug, fetchArticles } from "@/lib/api";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

// Next.js will fetch params dynamically if not found in static generation
// For now, we can skip static generation or fetch all slugs from API.
// Removing `generateStaticParams` for now as it relies on hardcoded data, and Next.js app router automatically handles dynamic routes.

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.lead,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.lead,
      publishedTime: article.publishedAt,
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.lead,
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) notFound();

  const imageCredit = /تصویر ارائه[\s‌-]*شده برای نمونه/.test(article.imageCredit ?? "")
    ? ""
    : article.imageCredit;

  // Fetch related articles from same category, excluding current
  const categoryArticles = await fetchArticles({ category: article.category.slug, pageSize: 4 });
  const related = categoryArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.lead,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: [article.imageUrl],
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "سینما نمایش" },
    articleSection: article.category.title,
    inLanguage: "fa-IR",
  };

  return (
    <main className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="article-desktop-layout">
      <article>
        <header className="article-header container-narrow">
          <Link
            className="category-label"
            href={`/category/${article.category.slug}`}
          >
            {article.category.title}
          </Link>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.lead}</p>
          <div className="article-byline">
            <div>
              <strong>{article.author}</strong>
              <span>{article.publishedLabel}</span>
            </div>
            <span>{article.readingTime} برای مطالعه</span>
          </div>
        </header>

        <figure className="article-figure container-wide">
          <div>
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              priority
              sizes="(max-width: 1100px) 100vw, 800px"
            />
          </div>
          {imageCredit ? <figcaption>{imageCredit}</figcaption> : null}
        </figure>

        <div className="article-body-layout container-wide">
          <div className="article-body">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {article.tags && article.tags.length > 0 ? (
              <div className="article-tags" aria-label="برچسب‌های خبر">
                {article.tags.map((tag) => <span key={tag.slug}>#{tag.title}</span>)}
              </div>
            ) : null}
            {article.sources && article.sources.length > 0 ? (
              <section className="article-sources">
                <h2>منابع خبر</h2>
                <ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title || source.publisher || source.url}</a></li>)}</ul>
              </section>
            ) : null}
          </div>
        </div>
        <ArticleEngagement slug={article.slug} />
      </article>

      <aside className="article-sidebar" aria-label="تبلیغات و مطالب مرتبط">
      <section className="container promotion-stack article-promotions">
        <EcranNewsPromo />
        <AdvertisementPlaceholder label="جایگاه تبلیغات" />
      </section>

      <section className="container home-section related-section">
        <SectionHeading title="مطالب مرتبط" />
        <div className="three-card-grid">
          {related.map((item) => (
            <ArticleCard article={item} key={item.slug} excerptClassName="!line-clamp-2 text-sm text-gray-600 dark:text-gray-400 mt-2" />
          ))}
        </div>
      </section>
      </aside>
      </div>
    </main>
  );
}
