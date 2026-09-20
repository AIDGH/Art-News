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
import { fetchArticles, fetchFeaturedArticles } from "@/lib/api";
import { ArticleCard } from "@/components/article-card";

const homepageSectionSlugs = [
  "news",
  "reviews-notes",
  "interviews",
  "screenings",
  "theater",
  "television",
  "home-video",
  "world-cinema",
];

function PremiumArticle({ article, isFeatured = false }: { article: Article; isFeatured?: boolean }) {
  const excerpt = article.lead || (article.body && article.body.length > 0 ? article.body[0] : "");
  return (
    <article className={`group flex ${isFeatured ? "flex-col gap-4" : "gap-4 items-center"}`}>
      <Link
        href={`/articles/${article.slug}`}
        className={`block overflow-hidden rounded-xl shrink-0 ${isFeatured ? "w-full aspect-[2/1] relative" : "w-32 md:w-48 aspect-[3/2] relative"}`}
      >
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={isFeatured ? "(max-width: 760px) 100vw, 800px" : "(max-width: 760px) 30vw, 200px"}
          priority={isFeatured}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <h3 className={`text-slate-900 font-extrabold group-hover:text-orange-600 transition-colors duration-300 ${isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"} line-clamp-2`}>
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
}

export default async function HomePage() {
  const [uiArticles, selectedFeaturedArticles] = await Promise.all([
    fetchArticles(),
    fetchFeaturedArticles(),
  ]);
  const featuredArticles = selectedFeaturedArticles.length > 0
    ? selectedFeaturedArticles
    : uiArticles.slice(0, 4);
  const sectionArticles = homepageSectionSlugs
    .map((slug) => uiArticles.find((a) => a.category.slug === slug))
    .filter((article) => article !== undefined) as Article[];

  const latestNewsArticles = [...uiArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 8);

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
        <SectionHeading title="خبرها" />
        <div className="flex flex-col gap-6">
          {latestNewsArticles.length > 0 && (
            <div className="mb-2">
              <PremiumArticle 
                article={latestNewsArticles[0]} 
                isFeatured={true} 
              />
            </div>
          )}
          <div className="flex flex-col gap-6">
            {latestNewsArticles.slice(1).map((article) => (
              <PremiumArticle 
                key={article.slug} 
                article={article} 
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container compact-home-section mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
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
        <Link href="/category/videos">فیلم</Link>
        <Link href="/english" lang="en">
          English
        </Link>
      </nav>
    </main>
  );
}
