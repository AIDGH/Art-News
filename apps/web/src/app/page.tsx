import Image from "next/image";
import Link from "next/link";
import { FeaturedNewsCarousel } from "@/components/featured-news-carousel";
import { NewsTicker, type TickerItem } from "@/components/news-ticker";
import {
  AdvertisementPlaceholder,
  EcranNewsPromo,
} from "@/components/promotion-blocks";
import { SectionHeading } from "@/components/section-heading";
import { type Article } from "@/lib/news";

const homepageSectionSlugs = [
  "news",
  "reviews-notes",
  "theater",
  "television",
  "home-video",
  "world-cinema",
];

async function fetchArticles() {
  try {
    const res = await fetch("http://localhost:4001/api/v1/articles?pageSize=30", {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error("Failed to fetch articles:", await res.text());
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

function mapApiArticleToUi(apiArticle: any): Article {
  return {
    slug: apiArticle.slug,
    title: apiArticle.title,
    lead: apiArticle.lead,
    category: apiArticle.category,
    imageUrl: apiArticle.coverImage?.url || "/images/placeholder.jpg",
    imageAlt: apiArticle.coverImage?.alt || "",
    imageCredit: apiArticle.coverImage?.credit || "",
    publishedAt: apiArticle.publishedAt,
    publishedLabel: new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(apiArticle.publishedAt)),
    readingTime: "۳ دقیقه",
    author: apiArticle.author?.displayName || apiArticle.author?.username || "",
    body: [apiArticle.body || ""],
  };
}

export default async function HomePage() {
  const apiArticles = await fetchArticles();
  const uiArticles = apiArticles.map(mapApiArticleToUi);

  const featuredArticles = uiArticles.slice(0, 4);
  const sectionArticles = homepageSectionSlugs
    .map((slug) => uiArticles.find((a) => a.category.slug === slug))
    .filter((article) => article !== undefined) as Article[];

  const tickerItems: TickerItem[] = uiArticles.slice(0, 8).map((a) => ({
    id: a.slug,
    headline: a.title,
    href: `/articles/${a.slug}`,
  }));

  return (
    <main>
      <NewsTicker items={tickerItems} />

      {featuredArticles.length > 0 && (
        <FeaturedNewsCarousel articles={featuredArticles} />
      )}

      <section className="container promotion-stack promotion-stack-compact">
        <EcranNewsPromo />
        <AdvertisementPlaceholder label="جایگاه تبلیغات صفحه اصلی" />
      </section>

      <section className="container compact-home-section">
        <SectionHeading eyebrow="مرور سریع" title="تازه از بخش‌ها" />
        <div className="compact-news-grid">
          {sectionArticles.map((article) => (
            <article className="compact-news-item" key={article.slug}>
              <Link
                className="compact-news-image"
                href={`/articles/${article.slug}`}
              >
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 700px) 34vw, 210px"
                />
              </Link>
              <div>
                <Link
                  className="category-label"
                  href={`/category/${article.category.slug}`}
                >
                  {article.category.title}
                </Link>
                <h2>
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
                <span>{article.publishedLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav
        className="container compact-media-links"
        aria-label="بخش‌های چندرسانه‌ای"
      >
        <Link href="/category/photos">عکس</Link>
        <Link href="/category/videos">فیلم و ویدیو</Link>
        <Link href="/english" lang="en">
          English
        </Link>
      </nav>
    </main>
  );
}
