"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type TouchEvent } from "react";
import type { Article } from "@/lib/news";

type FeaturedNewsCarouselProps = {
  articles: Article[];
};

export function FeaturedNewsCarousel({ articles }: FeaturedNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    setCurrentIndex((index + articles.length) % articles.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const endX = event.changedTouches[0]?.clientX;

    if (touchStartX.current === null || endX === undefined) return;

    const distance = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(distance) < 48) return;
    goTo(currentIndex + (distance > 0 ? 1 : -1));
  };

  if (articles.length === 0) return null;

  return (
    <section className="container featured-carousel" aria-label="خبرهای مهم">
      <div
        className="featured-carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="featured-carousel-track"
          style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
        >
          {articles.map((article, index) => (
            <article
              className="featured-carousel-slide"
              aria-hidden={index !== currentIndex}
              dir="rtl"
              key={article.slug}
            >
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                priority={index === 0}
                sizes="(max-width: 820px) 100vw, 1280px"
              />
              <div className="featured-carousel-overlay" />
              <div className="featured-carousel-copy">
                <Link
                  className="featured-carousel-category"
                  href={`/category/${article.category.slug}`}
                  tabIndex={index === currentIndex ? 0 : -1}
                >
                  خبر مهم · {article.category.title}
                </Link>
                {index === 0 ? (
                  <h1>
                    <Link
                      href={`/articles/${article.slug}`}
                      tabIndex={index === currentIndex ? 0 : -1}
                    >
                      {article.title}
                    </Link>
                  </h1>
                ) : (
                  <h2>
                    <Link
                      href={`/articles/${article.slug}`}
                      tabIndex={index === currentIndex ? 0 : -1}
                    >
                      {article.title}
                    </Link>
                  </h2>
                )}
                <p>{article.lead}</p>
                <div className="featured-carousel-meta">
                  <span>{article.publishedLabel}</span>
                  <span>{article.readingTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length > 1 ? (
          <div className="featured-carousel-controls">
            <button
              type="button"
              aria-label="خبر مهم قبلی"
              onClick={() => goTo(currentIndex - 1)}
            >
              →
            </button>
            <span aria-live="polite" dir="rtl">
              {(currentIndex + 1).toLocaleString("fa-IR")} از{" "}
              {articles.length.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              aria-label="خبر مهم بعدی"
              onClick={() => goTo(currentIndex + 1)}
            >
              ←
            </button>
          </div>
        ) : null}
      </div>

      {articles.length > 1 ? (
        <div className="featured-carousel-dots" aria-label="انتخاب خبر مهم">
          {articles.map((article, index) => (
            <button
              type="button"
              aria-label={`نمایش خبر ${index + 1}: ${article.title}`}
              aria-current={index === currentIndex ? "true" : undefined}
              onClick={() => goTo(index)}
              key={article.slug}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
