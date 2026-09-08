"use client";

import Link from "next/link";

// Dummy ticker items — will be replaced with API data when backend is wired up
export type TickerItem = {
  id: string;
  headline: string;
  href: string;
};

const tickerItems: TickerItem[] = [
  {
    "id": "1",
    "headline": "بعد از ۱۴ سال، بازگشت «عموهای فیتیله‌ای» با شوتینگا به سینما",
    "href": "/articles/fitileh-uncles-return-with-shootinga"
  },
  {
    "id": "2",
    "headline": "رونمایی از نخستین تصویر لیلا حاتمی در «بُت»",
    "href": "/articles/first-look-leila-hatami-in-bot"
  },
  {
    "id": "3",
    "headline": "«قاتل و وحشی» حمید نعمت‌الله پس از هفت سال همچنان در توقیف است",
    "href": "/articles/first-look-leila-hatami-in-bot"
  },
  {
    "id": "4",
    "headline": "نسخه مرمت‌شده یک اثر کلاسیک پس از ماه‌ها کار به شبکه نمایش خانگی می‌رسد",
    "href": "/articles/restored-classic-reaches-home-video"
  },
  {
    "id": "5",
    "headline": "بازگشت تئاتر به خانه‌ای که سال‌ها خالی مانده بود؛ روایتی از اجرای متفاوت",
    "href": "/articles/theater-returns-to-an-abandoned-house"
  },
  {
    "id": "6",
    "headline": "اولین تصاویر از کارگاه تولید فیلم تازه و بازسازی دکور صنعتی منتشر شد",
    "href": "/articles/first-look-new-film-production-workshop"
  },
  {
    "id": "7",
    "headline": "گفت‌وگو با طراحانی که آرشیو استوری‌بورد می‌سازند تا میراث بصری سینما حفظ شود",
    "href": "/articles/storyboard-artists-build-visual-archive"
  },
  {
    "id": "8",
    "headline": "سینمای مستقل چگونه با نمایش‌های کوچک و گفت‌وگوهای بعد از فیلم تماشاگر تازه پیدا می‌کند؟",
    "href": "/articles/independent-cinema-finds-new-audience"
  }
];

export function NewsTicker() {
  return (
    <div className="news-ticker" role="marquee" aria-label="نوار متحرک اخبار تازه">
      <span className="news-ticker-label" aria-hidden="true">تازه‌ترین</span>
      <div className="news-ticker-viewport">
        <div className="news-ticker-track">
          {/* First block — real, focusable links */}
          <div className="news-ticker-content">
            {tickerItems.map((item) => (
              <span key={item.id} className="news-ticker-item">
                <Link href={item.href}>{item.headline}</Link>
                <span className="news-ticker-dot" aria-hidden="true">◆</span>
              </span>
            ))}
          </div>
          {/* Second block — visual duplicate only, hidden from AT */}
          <div className="news-ticker-content" aria-hidden="true">
            {tickerItems.map((item) => (
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