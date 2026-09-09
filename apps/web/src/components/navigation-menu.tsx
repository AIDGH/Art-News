"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SubItem {
  href: string;
  icon: string;
  label: string;
}

interface MenuItem {
  href?: string;
  icon: string;
  label: string;
  lang?: string;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { href: "/", icon: "⌂", label: "صفحه نخست" },
  {
    icon: "◉◉",
    label: "سینما",
    href: "/category/cinema",
    subItems: [
      { href: "/category/news", icon: "▤", label: "خبر" },
      { href: "/category/reviews-notes", icon: "✎", label: "نقد و یادداشت" },
      { href: "/category/interviews", icon: "❝", label: "گفت‌وگو" },
      { href: "/category/screenings", icon: "◫", label: "نمایش" },
    ],
  },
  { href: "/category/theater", icon: "╰╯", label: "تئاتر" },
  { href: "/category/television", icon: "▣⌄", label: "تلویزیون" },
  { href: "/category/home-video", icon: "⌂▷", label: "شبکه نمایش خانگی" },
  { href: "/category/world-cinema", icon: "⊕◉", label: "سینمای جهان" },
  { href: "/category/photos", icon: "▧", label: "عکس" },
  { href: "/category/videos", icon: "▷│", label: "فیلم" },
  { href: "/english", icon: "A", label: "English", lang: "en" },
  { href: "/about", icon: "ⓘ", label: "درباره ما" },
];

export function DesktopNavigation() {
  const desktopItems = menuItems.filter((item) => item.href !== "/");

  return (
    <nav
      aria-label="دسته‌بندی‌های اصلی"
      className="hidden min-w-0 flex-1 lg:block"
    >
      <ul className="flex list-none items-center justify-start gap-3 p-0 xl:gap-4">
        {desktopItems.map((item) => (
          <li
            className={item.subItems ? "group relative" : "relative"}
            key={item.href}
          >
            <Link
              href={item.href || "#"}
              lang={item.lang}
              className="relative flex min-h-11 items-center whitespace-nowrap px-2.5 text-[12px] font-bold text-[var(--ink-soft)] transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-[var(--accent)] after:transition-transform hover:text-[var(--ink)] hover:after:scale-x-100 focus-visible:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--ink)] xl:px-3 xl:text-[13px]"
            >
              {item.label}
            </Link>

            {item.subItems ? (
              <ul className="invisible pointer-events-none absolute start-0 top-full z-50 min-w-48 translate-y-2 list-none border border-[var(--line)] bg-[var(--surface)] p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {item.subItems.map((subItem) => (
                  <li key={subItem.href}>
                    <Link
                      href={subItem.href}
                      className="block rounded-md px-3 py-2.5 text-sm font-bold text-[var(--ink)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--accent)] focus-visible:bg-[var(--paper)] focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative lg:hidden" ref={rootRef}>
      {/* Hamburger Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "بستن منو" : "نمایش منوی اصلی"}
        aria-expanded={isOpen}
        aria-controls="site-navigation-panel"
        onClick={() => setIsOpen((current) => !current)}
        className="w-10 h-10 md:w-11 md:h-11 flex flex-col items-center justify-center gap-1.5 rounded-full border border-[var(--line-dark)] text-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-all duration-160 cursor-pointer"
      >
        <span
          className={`block w-4 h-[1.5px] bg-current transition-transform duration-200 ${
            isOpen ? "rotate-45 translate-y-[4.5px]" : ""
          }`}
        />
        <span
          className={`block w-4 h-[1.5px] bg-current transition-opacity duration-200 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block w-4 h-[1.5px] bg-current transition-transform duration-200 ${
            isOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
          }`}
        />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="بستن منو با کلیک روی پس‌زمینه"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs border-0 cursor-default transition-opacity"
        />
      )}

      {/* Drawer Panel */}
      <aside
        id="site-navigation-panel"
        aria-label="منوی ناوبری اصلی سایت"
        aria-hidden={!isOpen}
        className={`fixed top-0 bottom-0 start-0 z-50 w-[min(380px,calc(100vw-32px))] h-[100dvh] bg-[var(--surface)] text-[var(--ink)] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="mobile-menu-header flex items-center justify-between border-b-2 border-[var(--ink)] bg-[var(--surface)]">
          <div className="flex flex-col">
            <span className="block text-xs font-bold tracking-wider text-[var(--accent)]">
              منوی اصلی
            </span>
            <strong className="block text-xl md:text-2xl font-black text-[var(--ink)] mt-0.5">
              سینما نمایش
            </strong>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="بستن منو"
            onClick={closeMenu}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--line-dark)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white hover:border-[var(--ink)] transition-colors text-2xl leading-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] shrink-0"
          >
            ×
          </button>
        </div>

        {/* Scrollable Menu Container */}
        <div className="mobile-menu-body flex-1 overflow-y-auto py-4">
          <nav aria-label="پیوندهای منو">
            <ul className="flex flex-col divide-y divide-[var(--line)] list-none p-0 m-0">
              {menuItems.map((item) => {
                if (item.subItems) {
                  return (
                    <li key={item.label} className="py-2.5 px-1">
                      <div className="flex items-center justify-between min-h-[44px]">
                        <Link
                          href={item.href || "#"}
                          onClick={closeMenu}
                          className="flex flex-1 items-center gap-3 py-1 text-base font-extrabold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                        >
                          <span
                            aria-hidden="true"
                            className="menu-topic-icon"
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-label={`نمایش یا پنهان‌سازی زیرمنوی ${item.label}`}
                          aria-expanded={isCinemaOpen}
                          onClick={() => setIsCinemaOpen((prev) => !prev)}
                          className="w-9 h-9 flex items-center justify-center text-[var(--ink)] hover:text-[var(--accent)] cursor-pointer rounded-full hover:bg-[var(--paper)] transition-colors shrink-0"
                        >
                          <span
                            aria-hidden="true"
                            className={`text-lg font-bold transition-transform duration-200 inline-block ${
                              isCinemaOpen ? "rotate-0" : "-rotate-90"
                            }`}
                          >
                            ⌄
                          </span>
                        </button>
                      </div>

                      {isCinemaOpen && (
                        <ul className="flex flex-col gap-1.5 ps-10 pt-2 pb-1 border-s-2 border-[var(--line)] ms-3 my-1.5 list-none">
                          {item.subItems.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={closeMenu}
                                className="flex items-center gap-2.5 py-1.5 text-sm font-semibold rounded-md text-[var(--ink-soft)] hover:text-[var(--accent)] hover:bg-[var(--paper)] transition-colors"
                              >
                                <span
                                  aria-hidden="true"
                                  className="menu-subtopic-icon"
                                >
                                  {sub.icon}
                                </span>
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={item.href} className="py-1 px-1">
                    <Link
                      href={item.href || "#"}
                      lang={item.lang}
                      onClick={closeMenu}
                      className="flex items-center gap-3 min-h-[44px] py-1 text-base font-bold text-[var(--ink)] hover:text-[var(--accent)] hover:bg-[var(--paper)] rounded-md transition-colors"
                    >
                      <span
                        aria-hidden="true"
                        className="menu-topic-icon"
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Drawer Footer info */}
        <div className="px-6 py-4 border-t border-[var(--line)] bg-[var(--paper)] text-xs text-[var(--ink-soft)] flex items-center justify-between">
          <span>رسانه سینما و نمایش</span>
          <span className="font-mono text-[11px]">نسخه ۱.۰</span>
        </div>
      </aside>
    </div>
  );
}
