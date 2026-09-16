import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره ما | پایگاه خبری سینما نمایش",
  description:
    "آشنایی با ماموریت، مجوز رسمی و شبکه‌های اجتماعی پایگاه خبری سینما نمایش.",
  alternates: { canonical: "/about" },
};

/* ─── SVG Icons ──────────────────────────────────────────────── */

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TelegramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

function BaleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h.01" strokeWidth="2.4" />
      <path d="M12 12h.01" strokeWidth="2.4" />
      <path d="M16 12h.01" strokeWidth="2.4" />
    </svg>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto pt-10 pb-24 px-6">
      <main>

        {/* 2. Typography: Main heading — elegant, not oversized */}
        <h1 className="text-3xl font-extrabold mb-6 text-slate-900 tracking-tight">
          درباره سینما نمایش
        </h1>

        {/* 2. Typography: Body text — comfortable reading size & line-height */}
        <div className="text-base sm:text-lg leading-loose text-slate-700 text-justify sm:text-right mb-16">
          <p>
            «سینما نمایش» رسانه‌ای مستقل در حوزه سینما، تئاتر، تلویزیون و هنرهای
            نمایشی است. روایتی موثق و تحلیلی از
            رویدادهای فرهنگی ارائه می‌دهیم.
          </p>
        </div>

        {/* 3. License Info Box: subtle elegant card */}
        <div className="mb-16 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-600 text-center">
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            <span>فعالیت این رسانه تحت نظارت</span>
            <a
              href="https://e-rasaneh.ir/Certificate/101661"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-orange-600 hover:opacity-80 transition-opacity"
              aria-label="مشاهده گواهی رسمی رسانه در سامانه جامع رسانه‌ها"
            >
              <span>وزارت فرهنگ و ارشاد اسلامی</span>
              <span aria-hidden="true" className="text-xs">↗</span>
            </a>
            <span>
              با شناسه <strong className="font-bold">۱۰۱۶۶۱</strong> می‌باشد.
            </span>
          </p>
        </div>

        {/* 4. Social Icons: centered, neatly grouped with premium styling */}
        <div className="flex justify-center gap-4">
          <a
            href="https://instagram.com/cinemanamayesh_ir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="صفحه اینستاگرام"
            className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-orange-500 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>

          <div
            aria-label="کانال تلگرام — به‌زودی"
            className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 cursor-not-allowed relative group transition-all duration-300 shadow-sm"
          >
            <TelegramIcon className="w-5 h-5" />
            <span className="absolute -top-9 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">
              به‌زودی
            </span>
          </div>

          <div
            aria-label="کانال یوتیوب — به‌زودی"
            className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 cursor-not-allowed relative group transition-all duration-300 shadow-sm"
          >
            <YouTubeIcon className="w-5 h-5" />
            <span className="absolute -top-9 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">
              به‌زودی
            </span>
          </div>

          <div
            aria-label="کانال بله — به‌زودی"
            className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 cursor-not-allowed relative group transition-all duration-300 shadow-sm"
          >
            <BaleIcon className="w-5 h-5" />
            <span className="absolute -top-9 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">
              به‌زودی
            </span>
          </div>
        </div>

        {/* 5. Back Link: centered secondary button-style link */}
        <div className="flex justify-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors"
          >
            <span>←</span>
            <span>بازگشت به خانه</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
