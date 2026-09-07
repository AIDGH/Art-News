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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex justify-center">
      <main className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">

        {/* Main Title */}
        <h1 className="text-xl sm:text-3xl font-black text-center text-[var(--ink)] mb-6">
          پایگاه خبری سینما نمایش
        </h1>

        {/* Editorial Intro Text */}
        <p className="text-sm sm:text-base leading-[2.2] sm:leading-[2.2] text-justify sm:text-center text-[var(--ink-soft)] mb-8">
          «سینما نمایش» رسانه‌ای مستقل در حوزه سینما، تئاتر، تلویزیون و هنرهای
          نمایشی است. با تکیه بر تجربه «اکران نیوز»، روایتی موثق و تحلیلی از
          رویدادهای فرهنگی ارائه می‌دهیم.
        </p>

        {/* License Badge */}
        <div className="flex justify-center mb-10">
          <a
            href="https://e-rasaneh.ir/Certificate/101661"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--line)] text-xs font-medium text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            aria-label="مشاهده گواهی رسمی رسانه در سامانه جامع رسانه‌ها"
          >
            <span className="text-[var(--accent)] text-sm">✦</span>
            <span>
              مجوز رسمی وزارت فرهنگ و ارشاد — شناسه{" "}
              <strong className="font-bold">۱۰۱۶۶۱</strong>
            </span>
            <span aria-hidden="true" className="opacity-40">↗</span>
          </a>
        </div>

        {/* Clean Divider */}
        <hr className="border-[var(--line)] border-t mb-8" />

        {/* Social Media Heading */}
        <h2 className="text-center text-sm font-bold text-[var(--ink-soft)] mb-6 opacity-80">
          شبکه‌های اجتماعی
        </h2>

        {/* Grid: 1 column on mobile, 2 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Instagram — active */}
          <a
            href="https://instagram.com/cinemanamayesh_ir"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="صفحه اینستاگرام سینما نمایش"
            className="group w-full flex flex-col items-center p-4 border border-[var(--line)] rounded-2xl bg-[var(--paper)] hover:border-pink-400 hover:shadow-md transition-all duration-200 gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform duration-200">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-extrabold text-[var(--ink)] group-hover:text-pink-600 transition-colors">
                اینستاگرام
              </span>
              <span className="block text-[11px] font-mono text-[var(--ink-soft)]/70 mt-0.5">
                @cinemanamayesh_ir
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              فعال
            </span>
          </a>

          {/* Telegram — placeholder */}
          <div
            aria-label="کانال تلگرام — به‌زودی"
            className="w-full flex flex-col items-center p-4 border border-[var(--line)] rounded-2xl bg-[var(--paper)]/50 opacity-70 select-none cursor-default gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
              <TelegramIcon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-extrabold text-[var(--ink-soft)]">تلگرام</span>
              <span className="block text-[11px] font-mono text-[var(--ink-soft)]/50 mt-0.5">
                @cinemanamayesh
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              به‌زودی
            </span>
          </div>

          {/* YouTube — placeholder */}
          <div
            aria-label="کانال یوتیوب — به‌زودی"
            className="w-full flex flex-col items-center p-4 border border-[var(--line)] rounded-2xl bg-[var(--paper)]/50 opacity-70 select-none cursor-default gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <YouTubeIcon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-extrabold text-[var(--ink-soft)]">یوتیوب</span>
              <span className="block text-[11px] font-mono text-[var(--ink-soft)]/50 mt-0.5">
                Cinema Namayesh
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              به‌زودی
            </span>
          </div>

          {/* Bale — placeholder */}
          <div
            aria-label="کانال بله — به‌زودی"
            className="w-full flex flex-col items-center p-4 border border-[var(--line)] rounded-2xl bg-[var(--paper)]/50 opacity-70 select-none cursor-default gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <BaleIcon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-extrabold text-[var(--ink-soft)]">بله</span>
              <span className="block text-[11px] font-mono text-[var(--ink-soft)]/50 mt-0.5">
                @cinemanamayesh
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              به‌زودی
            </span>
          </div>

        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent)] hover:underline"
          >
            <span>← بازگشت به صفحه نخست</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
