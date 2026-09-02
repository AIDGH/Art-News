import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import {
  AdvertisementPlaceholder,
  EcranNewsPromo,
} from "@/components/promotion-blocks";
import { SectionHeading } from "@/components/section-heading";
import { articles, categories, getCategoryArticles } from "@/lib/news";

export default function HomePage() {
  const [lead, ...latest] = articles;
  const spotlight = latest.slice(0, 2);
  const latestRail = latest.slice(2, 7);
  const cinemaNews = [
    ...getCategoryArticles("news"),
    ...getCategoryArticles("world-cinema"),
  ].slice(0, 3);
  const cultureMix = [
    articles.find((article) => article.category.slug === "reviews-notes"),
    articles.find((article) => article.category.slug === "theater"),
    articles.find((article) => article.category.slug === "television"),
  ].filter((article) => article !== undefined);

  return (
    <main>
      <section className="news-flash" aria-label="خبر فوری نمونه">
        <div className="container news-flash-inner">
          <strong>تازه</strong>
          <Link href={`/articles/${latest[0].slug}`}>
            {latest[0].title}
          </Link>
          <span>←</span>
        </div>
      </section>

      <section className="container lead-layout">
        <article className="lead-story">
          <Link className="lead-image" href={`/articles/${lead.slug}`}>
            <Image
              src={lead.imageUrl}
              alt={lead.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 760px"
            />
          </Link>
          <div className="lead-copy">
            <Link className="category-label" href={`/category/${lead.category.slug}`}>
              خبر مهم · {lead.category.title}
            </Link>
            <h1>
              <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
            </h1>
            <p>{lead.lead}</p>
            <div className="article-meta">
              <span>{lead.publishedLabel}</span>
              <span>{lead.readingTime}</span>
            </div>
          </div>
        </article>

        <div className="spotlight-column">
          {spotlight.map((article) => (
            <ArticleCard article={article} variant="compact" key={article.slug} />
          ))}
        </div>

        <aside className="latest-rail" aria-label="تازه‌ترین خبرها">
          <div className="rail-title">
            <span />
            <h2>تازه‌ترین‌ها</h2>
          </div>
          <ol>
            {latestRail.map((article, index) => (
              <li key={article.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  <small>{article.category.title}</small>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="container promotion-stack">
        <EcranNewsPromo />
        <AdvertisementPlaceholder label="جایگاه تبلیغات صفحه اصلی" />
      </section>

      <section className="editorial-note">
        <div className="container editorial-note-inner">
          <span>یادداشت روز</span>
          <p>
            سینما فقط روی پرده اتفاق نمی‌افتد؛ پشت صحنه، گفت‌وگوها و تجربه
            تماشاگران هم بخشی از روایت آن هستند.
          </p>
          <Link href={`/articles/${articles[6].slug}`}>ادامه یادداشت ←</Link>
        </div>
      </section>

      <section className="container home-section">
        <SectionHeading
          eyebrow="از تحریریه"
          title="خبرهای سینما"
          href="/category/news"
        />
        <div className="three-card-grid">
          {cinemaNews.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      </section>

      <section className="home-section home-section-dark">
        <div className="container">
          <SectionHeading eyebrow="پیشنهاد سینما نمایش" title="این هفته بخوانید" />
          <div className="feature-row">
            <div className="feature-row-image">
              <Image
                src={articles[5].imageUrl}
                alt={articles[5].imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
              />
            </div>
            <div className="feature-row-copy">
              <span>{articles[5].category.title}</span>
              <h2>{articles[5].title}</h2>
              <p>{articles[5].lead}</p>
              <Link href={`/articles/${articles[5].slug}`}>خواندن گزارش ←</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container home-section">
        <SectionHeading eyebrow="خواندنی‌ها" title="نقد، تئاتر و تلویزیون" />
        <div className="three-card-grid">
          {cultureMix.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      </section>

      <section className="container category-directory">
        <SectionHeading eyebrow="همه موضوع‌ها" title="در سینما نمایش بچرخید" />
        <div className="category-links">
          {categories.map((category, index) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{category.title}</strong>
              <small>{category.description}</small>
              <b>←</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
