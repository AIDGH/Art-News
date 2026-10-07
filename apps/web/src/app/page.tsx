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
import { fetchArticles, fetchFeaturedArticles, fetchLatestCategoryContent } from "@/lib/api";

export const dynamic = "force-dynamic";

const homepageSectionSlugs = [
  "news",
  "reviews-notes",
  "interviews",
  "report",
  "theater",
  "television",
  "home-video",
  "world-cinema",
  "photos",
  "videos",
];

function PremiumArticle({ article }: { article: Article }) {
  const excerpt = article.lead || (article.body && article.body.length > 0 ? article.body[0] : "");
  return (
    <article className="group flex gap-4 items-center !py-2 md:!py-3">
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
}

export default async function HomePage() {
  const [uiArticles, selectedFeaturedArticles, latestCategoryContent] = await Promise.all([
    fetchArticles(),
    fetchFeaturedArticles(),
    fetchLatestCategoryContent(),
  ]);
  const featuredArticles = selectedFeaturedArticles.length > 0
    ? selectedFeaturedArticles
    : uiArticles.slice(0, 4);
  const sectionArticles = homepageSectionSlugs
    .map((slug) => {
      const latest = latestCategoryContent
        .filter((item) => item.category.slug === slug || (slug === "report" && item.category.slug === "screenings"))
        .sort((first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt))[0];
      return latest ? { ...latest, category: { ...latest.category, slug } } : undefined;
    })
    .filter((item) => item !== undefined);

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
        <SectionHeading title="تازه‌ها" />
        <div className="flex flex-col">
          {latestNewsArticles.map((article, index) => (
            <div key={article.slug}>
              {index > 0 && <hr className="border-t-[1.5px] border-dashed border-gray-300 !my-4 md:!my-5 w-full" />}
              <PremiumArticle article={article} />
            </div>
          ))}
        </div>
      </section>

      <hr className="border-t-[1.5px] border-dashed border-gray-300 w-full mt-8 mb-4" />

      <section className="container compact-home-section">
        <div className="compact-news-grid">
          {sectionArticles.map((article) => {
            const href = article.contentType === "MEDIA"
              ? `/category/${article.category.slug}`
              : `/articles/${article.slug}`;
            const publishedLabel = new Intl.DateTimeFormat("fa-IR", {
              year: "numeric", month: "long", day: "numeric",
            }).format(new Date(article.publishedAt));
            return (
              <article className="compact-news-item" key={article.category.slug}>
                <Link className="compact-news-image" href={href}>
                  <Image
                    src={article.coverImage?.url || "/images/placeholder.svg"}
                    alt={article.coverImage?.alt || article.title}
                    fill
                    unoptimized
                    sizes="(max-width: 700px) 34vw, 210px"
                  />
                </Link>
                <div>
                  <Link href={`/category/${article.category.slug}`}>
                    <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-md mb-2">
                      {article.category.title}
                    </span>
                  </Link>
                  <h2><Link href={href}>{article.title}</Link></h2>
                  <span>{publishedLabel}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <nav
        className="container compact-media-links"
        aria-label="بخش‌های چندرسانه‌ای"
      >
        <Link href="/english" lang="en">
          English
        </Link>
      </nav>
    </main>
  );
}
