import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ArticleEngagement } from "@/components/article-engagement";
import { VideoPostPlayer } from "@/components/video-post-player";
import { AdvertisementPlaceholder } from "@/components/promotion-blocks";
import { SectionHeading } from "@/components/section-heading";
import { fetchArticleBySlug, fetchArticles } from "@/lib/api";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function ImageDownload({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      download
      className="photo-download"
      aria-label={label}
      title={label}
    >
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
    </a>
  );
}

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

  const isPhotoPost = article.category?.slug === "photos";
  const isPhotoAlbum = article.mediaPost?.kind === "PHOTOS";
  const imageUrl = article.imageUrl;

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
  const contentBlocks = article.contentBlocks?.map((block) => block.kind === "TEXT" ?
    <div
      key={block.id}
      className="article-html-body"
      dangerouslySetInnerHTML={{ __html: block.text ?? "" }}
    />
    : <div className={`article-inline-images${block.images.length === 1 ? " is-single" : ""}`} key={block.id}>
      {block.images.map(({ media }, index) => <figure key={index}>
        <div className="relative">
          <Image src={media.url} alt={media.alt} width={1000} height={750} unoptimized sizes="(max-width: 650px) 100vw, 420px" />
          {isPhotoPost ? <ImageDownload url={media.url} label={`دانلود عکس ${index + 1}`} /> : null}
        </div>
        {media.caption || media.credit ? <figcaption>{[media.caption, media.credit].filter(Boolean).join(" — ")}</figcaption> : null}
      </figure>)}
    </div>);

  const mainFigure = !article.videoPost && !isPhotoAlbum ? (
    <figure className="article-figure container-wide">
      <div className="relative">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          unoptimized={article.imageUrl.startsWith("/uploads/")}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 800px"
        />
        {isPhotoPost ? <ImageDownload url={imageUrl} label="دانلود عکس" /> : null}
      </div>
      {imageCredit ? <figcaption>{imageCredit}</figcaption> : null}
    </figure>
  ) : null;

  return (
    <main className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="article-desktop-layout">
        <article className={isPhotoPost ? "article-photo-post" : undefined}>
          {isPhotoPost ? (
            <div className="photo-category container-narrow">
              <Link className="category-label" href={`/category/${article.category.slug}`}>
                {article.category.title}
              </Link>
            </div>
          ) : null}
          {article.videoPost ? <VideoPostPlayer post={article.videoPost} /> : null}
          {isPhotoAlbum ? <div className="photo-album-images container-wide">{contentBlocks}</div> : null}
          {isPhotoPost ? mainFigure : null}
          <header className={`article-header container-narrow${article.videoPost ? " article-header-video" : ""}`}>
            {!isPhotoPost ? <Link
              className="category-label"
              href={`/category/${article.category.slug}`}
            >
              {article.category.title}
            </Link> : null}
            <h1>{article.title}</h1>
            {article.lead ? <p className="article-lead">{article.lead}</p> : null}
            <div className="article-byline">
              <span>{article.publishedLabel}</span>
            </div>
          </header>

          {!isPhotoPost ? mainFigure : null}

          <div className="article-body-layout container-wide">
            <div className="article-body">
              <div
                className="article-html-body"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
              {!isPhotoAlbum ? contentBlocks : null}
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
          {!article.mediaPost ? <ArticleEngagement slug={article.slug} /> : null}
        </article>

        <aside className="article-sidebar" aria-label="تبلیغات و مطالب مرتبط">
          <section className="container promotion-stack article-promotions">
            <AdvertisementPlaceholder label="جایگاه تبلیغات" placement="ARTICLE" />
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
