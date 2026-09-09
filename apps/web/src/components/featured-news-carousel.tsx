"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Article } from "@/lib/news";

type FeaturedNewsCarouselProps = {
  articles: Article[];
};

export function FeaturedNewsCarousel({ articles }: FeaturedNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackPosition, setTrackPosition] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const slideArticles =
    articles.length > 1
      ? [articles[articles.length - 1], ...articles, articles[0]]
      : articles;

  const moveBy = (step: number) => {
    if (articles.length < 2) return;
    setIsTeleporting(false);
    setCurrentIndex(
      (current) => (current + step + articles.length) % articles.length,
    );
    setTrackPosition((position) => position + step);
  };

  const goTo = (index: number) => {
    if (index === currentIndex) return;
    setIsTeleporting(false);
    setCurrentIndex(index);
    setTrackPosition(index + 1);
  };

  useEffect(() => {
    if (!isTeleporting) return;
    const frame = requestAnimationFrame(() => setIsTeleporting(false));
    return () => cancelAnimationFrame(frame);
  }, [isTeleporting]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;

    dragStartX.current = event.clientX;
    didDrag.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    if (Math.abs(distance) > 5) {
      didDrag.current = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    setDragOffset(distance);
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

    if (didDrag.current) {
      window.setTimeout(() => {
        didDrag.current = false;
      }, 0);
    }

    if (cancelled || Math.abs(distance) < 56) return;
    moveBy(distance > 0 ? 1 : -1);
  };

  const handleTransitionEnd = () => {
    if (trackPosition === 0) {
      setIsTeleporting(true);
      setTrackPosition(articles.length);
    } else if (trackPosition === articles.length + 1) {
      setIsTeleporting(true);
      setTrackPosition(1);
    }
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
          className={`featured-carousel-track${isDragging ? " is-dragging" : ""}${isTeleporting ? " is-teleporting" : ""}`}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(calc(${trackPosition * 100}% + ${dragOffset}px), 0, 0)`,
          }}
        >
          {slideArticles.map((article, slideIndex) => {
            const articleIndex =
              articles.length > 1
                ? (slideIndex - 1 + articles.length) % articles.length
                : 0;
            const isCurrent = slideIndex === trackPosition;

            return (
            <article
              className="featured-carousel-slide"
              aria-hidden={!isCurrent}
              dir="rtl"
              key={`${article.slug}-${slideIndex}`}
            >
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                loading={articleIndex === 0 ? "eager" : "lazy"}
                draggable={false}
                sizes="(max-width: 820px) 100vw, 1280px"
              />
              <div className="featured-carousel-overlay" />
              <Link
                className="featured-carousel-hit-area"
                href={`/articles/${article.slug}`}
                aria-label={`مشاهده خبر: ${article.title}`}
                draggable={false}
                tabIndex={isCurrent ? 0 : -1}
              />
              <div className="featured-carousel-copy">
                <span className="featured-carousel-category">خبر مهم</span>
                {articleIndex === 0 ? (
                  <h1>{article.title}</h1>
                ) : (
                  <h2>{article.title}</h2>
                )}
                <p>{article.lead}</p>
                <div className="featured-carousel-meta">
                  <span>{article.publishedLabel}</span>
                  <span>{article.readingTime}</span>
                </div>
              </div>
            </article>
            );
          })}
        </div>

        {articles.length > 1 ? (
          <div className="featured-carousel-controls" dir="ltr">
            <button
              type="button"
              aria-label="خبر مهم بعدی"
              onClick={() => moveBy(1)}
            >
              ←
            </button>
            <span
              className="featured-carousel-counter"
              aria-label={`خبر ${(currentIndex + 1).toLocaleString("fa-IR")} از ${articles.length.toLocaleString("fa-IR")}`}
              aria-live="polite"
              dir="rtl"
            >
              <b>{(currentIndex + 1).toLocaleString("fa-IR")}</b>
              <i>از</i>
              <b>{articles.length.toLocaleString("fa-IR")}</b>
            </span>
            <button
              type="button"
              aria-label="خبر مهم قبلی"
              onClick={() => moveBy(-1)}
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
