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
    <div className="w-full px-5 sm:px-8 py-12 sm:py-16 flex justify-center transition-colors duration-300">
      <main className="w-full max-w-2xl">
        {/* Main Title */}
        <h1 className="border-t border-gray-300 pt-4 text-4xl sm:text-5xl font-black text-gray-900 mb-8 tracking-tight">
          درباره سینما نمایش
        </h1>

        {/* Editorial Intro Text */}
        <div className="space-y-6 text-base sm:text-lg leading-[2.2] text-gray-800 text-justify sm:text-right font-medium">
          <p>
            «سینما نمایش» رسانه‌ای مستقل در حوزه سینما، تئاتر، تلویزیون و هنرهای
            نمایشی است. با تکیه بر تجربه «اکران نیوز»، روایتی موثق و تحلیلی از
            رویدادهای فرهنگی ارائه می‌دهیم.
          </p>
          
          <p className="text-sm sm:text-base flex flex-wrap items-center gap-1.5 pt-6 text-gray-800">
            <span className="opacity-90">فعالیت این رسانه تحت نظارت</span>
            <a
              href="https://e-rasaneh.ir/Certificate/101661"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
              aria-label="مشاهده گواهی رسمی رسانه در سامانه جامع رسانه‌ها"
            >
              <span>وزارت فرهنگ و ارشاد اسلامی</span>
              <span aria-hidden="true" className="text-xs">↗</span>
            </a>
            <span className="opacity-90">با شناسه <strong className="font-bold">۱۰۱۶۶۱</strong> می‌باشد.</span>
          </p>
        </div>

        {/* Clean Divider */}
        <div className="w-12 h-1 bg-[var(--accent)] my-12 rounded-full opacity-80" />

        {/* Social Media & Back Link Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mt-12">
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/cinemanamayesh_ir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="صفحه اینستاگرام"
              className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-gray-700 hover:text-orange-500 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            
            <div
              aria-label="کانال تلگرام — به‌زودی"
              className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-gray-700 hover:text-orange-500 hover:border-orange-500 cursor-not-allowed relative group transition-all duration-300"
            >
              <TelegramIcon className="w-5 h-5" />
              <span className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">به‌زودی</span>
            </div>

            <div
              aria-label="کانال یوتیوب — به‌زودی"
              className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-gray-700 hover:text-orange-500 hover:border-orange-500 cursor-not-allowed relative group transition-all duration-300"
            >
              <YouTubeIcon className="w-5 h-5" />
              <span className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">به‌زودی</span>
            </div>

            <div
              aria-label="کانال بله — به‌زودی"
              className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-gray-700 hover:text-orange-500 hover:border-orange-500 cursor-not-allowed relative group transition-all duration-300"
            >
              <BaleIcon className="w-5 h-5" />
              <span className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">به‌زودی</span>
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-orange-500 transition-colors"
          >
            <span>← بازگشت به خانه</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
