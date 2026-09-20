import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/news";

type ArticleCardProps = {
  article: Article;
  variant?: "standard" | "compact" | "horizontal";
  priority?: boolean;
  hideCategory?: boolean;
  excerptClassName?: string;
};

export function ArticleCard({
  article,
  variant = "standard",
  priority = false,
  hideCategory = false,
  excerptClassName,
}: ArticleCardProps) {
  const excerpt = article.lead || (article.body && article.body.length > 0 ? article.body[0] : "");
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
        {!hideCategory && (
          <Link className="category-label" href={`/category/${article.category.slug}`}>
            {article.category.title}
          </Link>
        )}
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {variant !== "compact" ? <p className={excerptClassName}>{excerpt}</p> : null}
        <div className="article-meta">
          <span>{article.publishedLabel}</span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
