import Link from "next/link";
import { categories } from "@/lib/news";

function BrandMark() {
  return (
    <Link className="brand" href="/" aria-label="هنرنامه، صفحه اصلی">
      <span className="brand-symbol" aria-hidden="true">
        <span />
        <span />
      </span>
      <span className="brand-copy">
        <strong>هنرنامه</strong>
        <small>روایت هنر امروز</small>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <>
      <div className="edition-bar">
        <div className="container edition-inner">
          <span>نسخه نمایشی</span>
          <span>یکشنبه ۹ شهریور ۱۴۰۵</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <BrandMark />
          <nav className="desktop-nav" aria-label="دسته‌بندی‌های اصلی">
            {categories.slice(0, 5).map((category) => (
              <Link href={`/category/${category.slug}`} key={category.slug}>
                {category.title}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="search-link" href="/search" aria-label="جست‌وجو">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </Link>
            <details className="mobile-menu">
              <summary aria-label="نمایش منو">
                <span />
                <span />
                <span />
              </summary>
              <nav aria-label="منوی موبایل">
                {categories.map((category) => (
                  <Link href={`/category/${category.slug}`} key={category.slug}>
                    {category.title}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
