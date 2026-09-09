"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTop, setSearchTop] = useState<number | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const updatePosition = () => {
      const header = triggerRef.current?.closest("header");
      const rect = header?.getBoundingClientRect();
      if (rect) setSearchTop(rect.top + rect.height / 2);
    };

    const frame = requestAnimationFrame(updatePosition);

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
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
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleToggle = () => {
    if (!isOpen) {
      const header = triggerRef.current?.closest("header");
      const rect = header?.getBoundingClientRect();
      if (rect) setSearchTop(rect.top + rect.height / 2);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "بستن جست‌وجو" : "جست‌وجو در سایت"}
        aria-expanded={isOpen}
        aria-controls="header-search-bar"
        className="header-search-trigger w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-[var(--line-dark)] text-[var(--ink)] hover:bg-[var(--paper-deep)] transition-colors duration-150 cursor-pointer"
      >
        <svg
          className="w-[18px] h-[18px] stroke-current fill-none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </button>

      {isOpen && (
        <div
          id="header-search-bar"
          role="search"
          aria-label="جست‌وجوی اخبار و مقالات"
          className="header-search-popover fixed z-[60] flex items-center"
          style={{
            top: searchTop ?? 0,
            left: "max(16px, calc((100vw - 1280px) / 2))",
            width: "min(28rem, calc(100vw - 32px))",
            transform: "translateY(-50%)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="header-search-form flex min-h-12 w-full items-center gap-2 rounded-full border border-[var(--line-dark)] bg-[var(--surface)] px-3 py-1.5 shadow-xl outline-none transition-[border-color,box-shadow] md:min-h-13 md:px-4"
          >
            <svg
              className="w-4 h-4 text-[var(--ink-soft)] stroke-current fill-none shrink-0"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جست‌وجوی خبر، گزارش، تحلیل..."
              className="header-search-input min-w-0 flex-1 appearance-none border-0 bg-transparent text-base font-medium text-[var(--ink)] outline-none ring-0 placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-0 [&::-webkit-search-cancel-button]:appearance-none md:text-sm"
              aria-label="متن جست‌وجو"
            />

            {query.length > 0 && (
              <button
                type="submit"
                aria-label="اجرای جست‌وجو"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--ink)] text-white transition-colors hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
              >
                <svg
                  className="h-4 w-4 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              aria-label="انصراف و بستن جست‌وجو"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg leading-none text-[var(--ink-soft)] transition-colors hover:bg-black/5 hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
