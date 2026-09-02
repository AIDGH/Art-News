"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const cinemaItems = [
  { href: "/category/news", label: "خبر" },
  { href: "/category/reviews-notes", label: "نقد و یادداشت" },
  { href: "/category/interviews", label: "گفت‌وگو" },
  { href: "/category/screenings", label: "نمایش" },
];

const navigationItems = [
  { href: "/category/theater", label: "تئاتر" },
  { href: "/category/television", label: "تلویزیون" },
  { href: "/category/home-video", label: "شبکه نمایش خانگی" },
  { href: "/category/world-cinema", label: "سینمای جهان" },
  { href: "/category/photos", label: "عکس" },
  { href: "/category/videos", label: "فیلم" },
  { href: "/english", label: "English", lang: "en" },
  { href: "/about", label: "درباره ما" },
];

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

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="navigation-menu" ref={rootRef}>
      <button
        className="menu-trigger"
        type="button"
        aria-label={isOpen ? "بستن منو" : "نمایش منو"}
        aria-expanded={isOpen}
        aria-controls="site-navigation-panel"
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen ? (
        <button
          className="menu-backdrop"
          type="button"
          aria-label="بستن منو"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        className={`menu-panel${isOpen ? " menu-panel-open" : ""}`}
        id="site-navigation-panel"
        aria-hidden={!isOpen}
      >
        <div className="menu-panel-header">
          <div>
            <span>منوی اصلی</span>
            <strong>سینما نمایش</strong>
          </div>
          <button
            className="menu-close"
            type="button"
            aria-label="بستن منو"
            onClick={closeMenu}
            ref={closeRef}
          >
            ×
          </button>
        </div>

        <nav className="menu-links" aria-label="منوی اصلی سایت">
          <Link href="/" onClick={closeMenu}>
            صفحه نخست
          </Link>

          <div className="menu-group">
            <div className="menu-group-heading">
              <Link href="/category/cinema" onClick={closeMenu}>
                سینما
              </Link>
              <button
                type="button"
                aria-label="نمایش زیرمنوی سینما"
                aria-expanded={isCinemaOpen}
                onClick={() => setIsCinemaOpen((current) => !current)}
              >
                <span aria-hidden="true">⌄</span>
              </button>
            </div>
            {isCinemaOpen ? (
              <div className="menu-submenu">
                {cinemaItems.map((item) => (
                  <Link href={item.href} onClick={closeMenu} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {navigationItems.map((item) => (
            <Link
              href={item.href}
              lang={item.lang}
              onClick={closeMenu}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
