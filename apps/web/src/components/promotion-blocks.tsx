import Image from "next/image";
import Link from "next/link";

type AdvertisementPlaceholderProps = {
  label?: string;
};

export function EcranNewsPromo() {
  return (
    <section
      className="ecran-promo bg-gradient-to-br from-zinc-900 via-zinc-900 to-black relative overflow-hidden"
      aria-label="معرفی رسانه اکران نیوز"
    >
      {/* Subtle orange radial glow in the corner for depth */}
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-600/10 blur-3xl" />

      <div
        className="relative flex items-center justify-center min-h-[92px] p-2"
        aria-hidden="true"
      >
        <div className="rounded-2xl overflow-hidden shadow-md shadow-white/10">
          <Image
            src="/ecran-logo.png"
            alt="لوگو اکران نیوز"
            width={180}
            height={60}
            className="object-contain max-h-[92px] w-auto"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="promo-kicker">رسانه همراه</span>
        <h2>اکران نیوز</h2>
        <p>
          برای پیگیری لحظه‌ای حواشی و اخبار سینما، به صفحه رسمی اکران نیوز در
          اینستاگرام بپیوندید.
        </p>
      </div>

      <Link
        href="https://instagram.com/ecrannews"
        target="_blank"
        rel="noopener noreferrer"
        className="ecran-promo-link bg-orange-600 text-white font-medium border-none hover:bg-orange-500 transition-colors shadow-lg rounded-lg py-2.5 text-sm whitespace-nowrap flex items-center justify-center"
      >
        اینستاگرام اکران نیوز
      </Link>
    </section>
  );
}

export function AdvertisementPlaceholder({
  label = "جایگاه تبلیغات",
}: AdvertisementPlaceholderProps) {
  return (
    <aside className="advertisement-placeholder" aria-label={label}>
      <span>تبلیغات</span>
      <strong>{label}</strong>
      <small>ابعاد و محتوای نهایی پس از دریافت سفارش تبلیغ مشخص می‌شود.</small>
    </aside>
  );
}
