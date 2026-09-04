import Link from "next/link";
import { NavigationMenu } from "@/components/navigation-menu";

function BrandMark() {
  return (
    <Link className="brand" href="/" aria-label="سینما نمایش، صفحه اصلی">
      <span className="brand-logo" aria-hidden="true" />
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
          <div className="header-actions">
            <Link className="search-link" href="/search" aria-label="جست‌وجو">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </Link>
            <NavigationMenu />
          </div>
        </div>
      </header>
    </>
  );
}
