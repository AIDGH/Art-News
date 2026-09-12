"use client";

import Link from "next/link";

export type TickerItem = {
  id: string;
  headline: string;
  href: string;
};

export function NewsTicker({ items = [] }: { items?: TickerItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="news-ticker" role="marquee" aria-label="نوار متحرک اخبار تازه">
      <span className="news-ticker-label" aria-hidden="true">تازه‌ترین</span>
      <div className="news-ticker-viewport">
        <div className="news-ticker-track">
          {/* First block — real, focusable links */}
          <div className="news-ticker-content">
            {items.map((item) => (
              <span key={item.id} className="news-ticker-item">
                <Link href={item.href}>{item.headline}</Link>
                <span className="news-ticker-dot" aria-hidden="true">◆</span>
              </span>
            ))}
          </div>
          {/* Second block — visual duplicate only, hidden from AT */}
          <div className="news-ticker-content" aria-hidden="true">
            {items.map((item) => (
              <span key={item.id} className="news-ticker-item">
                <Link href={item.href} tabIndex={-1}>{item.headline}</Link>
                <span className="news-ticker-dot" aria-hidden="true">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}