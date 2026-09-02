import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره رسانه سینمایی سینما نمایش و اکران نیوز.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="simple-page container-narrow">
      <span>درباره رسانه</span>
      <h1>سینما نمایش</h1>
      <p>
        سینما نمایش رسانه‌ای تخصصی برای خبر، نقد، گفت‌وگو و روایت‌های سینما،
        تئاتر، تلویزیون و شبکه نمایش خانگی است.
      </p>
      <div className="simple-page-note">
        اطلاعات کامل تحریریه، راه‌های ارتباطی و سابقه اکران نیوز پس از دریافت
        محتوای رسمی در این صفحه قرار می‌گیرد.
      </div>
    </main>
  );
}
