import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import {
  AdvertisementPlaceholder,
  EcranNewsPromo,
} from "@/components/promotion-blocks";
import {
  categories,
  getCategory,
  getCategoryArticles,
} from "@/lib/news";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const directArticles = getCategoryArticles(slug);
  const categoryArticles =
    directArticles.length >= 3
      ? directArticles
      : [
          ...directArticles,
          ...categories
            .flatMap((item) => getCategoryArticles(item.slug))
            .filter((article) => article.category.slug !== slug),
        ].slice(0, 7);
  const [lead, ...rest] = categoryArticles;

  if (!lead) notFound();

  return (
    <main className="category-page container">
      <header className="category-hero">
        <span>دسته‌بندی</span>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </header>

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
          <span className="category-label">انتخاب دبیر</span>
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
          <ArticleCard article={article} variant="horizontal" key={article.slug} />
        ))}
      </section>

      <section className="promotion-stack category-promotions">
        <EcranNewsPromo />
        <AdvertisementPlaceholder label="تبلیغات این بخش" />
      </section>
    </main>
  );
}
