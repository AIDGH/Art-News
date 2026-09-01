import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/news";

type ArticleCardProps = {
  article: Article;
  variant?: "standard" | "compact" | "horizontal";
  priority?: boolean;
};

export function ArticleCard({
  article,
  variant = "standard",
  priority = false,
}: ArticleCardProps) {
  return (
    <article className={`article-card article-card-${variant}`}>
      <Link className="article-card-image" href={`/articles/${article.slug}`}>
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          sizes={
            variant === "horizontal"
              ? "(max-width: 760px) 42vw, 280px"
              : "(max-width: 760px) 100vw, 420px"
          }
          priority={priority}
        />
      </Link>
      <div className="article-card-content">
        <Link className="category-label" href={`/category/${article.category.slug}`}>
          {article.category.title}
        </Link>
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {variant !== "compact" ? <p>{article.lead}</p> : null}
        <div className="article-meta">
          <span>{article.publishedLabel}</span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
