import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
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
    title: article.title,
    description: article.lead,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.lead,
      publishedTime: article.publishedAt,
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.lead,
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) notFound();

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
              sizes="(max-width: 1100px) 100vw, 1180px"
            />
          </div>
          <figcaption>{article.imageCredit}</figcaption>
        </figure>

        <div className="article-body-layout container-wide">
          <aside className="article-share" aria-label="اشتراک‌گذاری نمایشی">
            <span>اشتراک</span>
            <button type="button" aria-label="کپی لینک">پیوند</button>
            <button type="button" aria-label="اشتراک در شبکه اجتماعی">شبکه</button>
          </aside>
          <div className="article-body">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="demo-disclaimer">
              <strong>یادآوری</strong>
              <p>
                این مطلب بخشی از نسخه نمایشی قالب است و گزارش یک رویداد واقعی
                محسوب نمی‌شود.
              </p>
            </div>
          </div>
          <aside className="article-side-note">
            <span>در این پرونده</span>
            <strong>{article.category.title}</strong>
            <p>{article.category.description}</p>
          </aside>
        </div>
      </article>

      <section className="container promotion-stack article-promotions">
        <EcranNewsPromo />
        <AdvertisementPlaceholder label="تبلیغات پس از خبر" />
      </section>

      <section className="container home-section related-section">
        <SectionHeading eyebrow="ادامه مسیر" title="مطالب مرتبط" />
        <div className="three-card-grid">
          {related.map((item) => (
            <ArticleCard article={item} key={item.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
