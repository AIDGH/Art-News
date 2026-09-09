"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import type { Article } from "@/lib/news";

type FeaturedNewsCarouselProps = {
  articles: Article[];
};

export function FeaturedNewsCarousel({ articles }: FeaturedNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const goTo = (index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), articles.length - 1));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;

    dragStartX.current = event.clientX;
    didDrag.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    if (Math.abs(distance) > 5) didDrag.current = true;

    const isPastStart = currentIndex === 0 && distance > 0;
    const isPastEnd = currentIndex === articles.length - 1 && distance < 0;
    setDragOffset(isPastStart || isPastEnd ? distance * 0.22 : distance);
  };

  const finishDrag = (
    event: PointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);

    if (cancelled || Math.abs(distance) < 56) return;
    goTo(currentIndex + (distance < 0 ? 1 : -1));
  };

  if (articles.length === 0) return null;

  return (
    <section className="container featured-carousel" aria-label="خبرهای مهم">
      <div
        className={`featured-carousel-viewport${isDragging ? " is-dragging" : ""}`}
        onClickCapture={(event) => {
          if (!didDrag.current) return;
          event.preventDefault();
          event.stopPropagation();
          didDrag.current = false;
        }}
        onPointerCancel={(event) => finishDrag(event, true)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
      >
        <div
          className={`featured-carousel-track${isDragging ? " is-dragging" : ""}`}
          style={{
            transform: `translate3d(calc(-${currentIndex * 100}% + ${dragOffset}px), 0, 0)`,
          }}
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
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
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
          <div className="featured-carousel-controls" dir="ltr">
            <button
              type="button"
              aria-label="خبر مهم قبلی"
              disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
            >
              ←
            </button>
            <span aria-live="polite" dir="rtl">
              {(currentIndex + 1).toLocaleString("fa-IR")} از{" "}
              {articles.length.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              aria-label="خبر مهم بعدی"
              disabled={currentIndex === articles.length - 1}
              onClick={() => goTo(currentIndex + 1)}
            >
              →
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
