import Image from "next/image";
import Link from "next/link";
import { FeaturedNewsCarousel } from "@/components/featured-news-carousel";
import {
  AdvertisementPlaceholder,
  EcranNewsPromo,
} from "@/components/promotion-blocks";
import { SectionHeading } from "@/components/section-heading";
import { articles, getCategoryArticles } from "@/lib/news";

const homepageSectionSlugs = [
  "news",
  "reviews-notes",
  "theater",
  "television",
  "home-video",
  "world-cinema",
];

export default function HomePage() {
  const featuredArticles = articles.slice(0, 4);
  const sectionArticles = homepageSectionSlugs
    .map((slug) => getCategoryArticles(slug)[0])
    .filter((article) => article !== undefined);

  return (
    <main>
      <section className="news-flash" aria-label="تازه‌ترین خبر">
        <div className="container news-flash-inner">
          <strong>تازه</strong>
          <Link href={`/articles/${articles[1].slug}`}>{articles[1].title}</Link>
          <span>←</span>
        </div>
      </section>

      <FeaturedNewsCarousel articles={featuredArticles} />

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
