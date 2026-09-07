"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

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

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
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

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "بستن جست‌وجو" : "جست‌وجو در سایت"}
        aria-expanded={isOpen}
        aria-controls="header-search-bar"
        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-[var(--line-dark)] text-[var(--ink)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
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
          className="absolute start-0 top-0 -inset-x-2 -inset-y-2 md:inset-auto md:start-auto md:end-0 md:top-1/2 md:-translate-y-1/2 z-30 flex items-center"
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-[calc(100vw-32px)] max-w-md bg-[var(--surface)] border border-[var(--line)] shadow-lg rounded-full px-3 py-1.5 md:py-2 transition-all"
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
              className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none border-0 font-medium"
              aria-label="متن جست‌وجو"
            />

            {query.length > 0 && (
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-dark)] transition-colors shrink-0 cursor-pointer"
              >
                بیاب
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              aria-label="انصراف و بستن جست‌وجو"
              className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors shrink-0 text-base leading-none cursor-pointer"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
