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
  const isVideo = article.category?.slug === "videos" || article.category?.slug === "video";
  return (
    <article className={`article-card article-card-${variant}`}>
      <Link className={`article-card-image rounded-lg ${isVideo ? "!aspect-video" : ""}`} href={`/articles/${article.slug}`}>
        <Image
          src={article.imageUrl}
          unoptimized={article.imageUrl.startsWith("/uploads/")}
          alt={article.imageAlt}
          fill
          className="object-cover rounded-lg"
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
          <Link href={`/articles/${article.slug}`} className="line-clamp-3 md:line-clamp-4">{article.title}</Link>
        </h3>
        {variant !== "compact" ? <p className={excerptClassName}>{excerpt}</p> : null}
        <div className="article-meta">
          <span>{article.publishedLabel}</span>
        </div>
      </div>
    </article>
  );
}
