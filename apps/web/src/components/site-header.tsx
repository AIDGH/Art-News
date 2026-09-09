import Link from "next/link";
import { MobileSearch } from "@/components/mobile-search";
import {
  DesktopNavigation,
  NavigationMenu,
} from "@/components/navigation-menu";

function BrandMark() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
      aria-label="سینما نمایش، صفحه نخست"
    >
      <span
        className="block w-24 h-14 md:w-28 md:h-16 bg-[url('/logo-cinema-namayesh.png')] bg-center bg-[length:165%_auto] bg-no-repeat mix-blend-multiply"
        aria-hidden="true"
      />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <>
      {/* Edition & Date Bar */}
      <div className="bg-[var(--night)] text-[#f6efe5] text-xs py-1.5 border-b border-[var(--night-soft)]">
        <div className="container flex items-center justify-between min-h-[26px]">
          <span className="text-[#f6a28e] font-semibold text-[11px] md:text-xs">
            پایگاه خبری سینما نمایش
          </span>
          <span className="text-stone-300 text-[11px] md:text-xs">
            یکشنبه ۹ شهریور ۱۴۰۵
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--line)] shadow-xs">
        <div className="container min-h-[72px] md:min-h-[84px] flex items-center gap-3 xl:gap-5 py-2">
          <BrandMark />
          <DesktopNavigation />

          <div className="header-mobile-actions flex shrink-0 items-center gap-2 sm:gap-3">
            <MobileSearch />
            <NavigationMenu />
          </div>
        </div>
      </header>
    </>
  );
}
