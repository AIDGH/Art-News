import Link from "next/link";
import { categories } from "@/lib/news";
import { ERasanehTrustSeal } from "@/components/e-rasaneh-trust-seal";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong className="footer-brand">سینما نمایش</strong>
          <p>
            رسانه‌ای برای خبر، نقد و گفت‌وگو درباره سینما، تئاتر، تلویزیون و
            شبکه نمایش خانگی؛ با سابقه فعالیت رسانه‌ای با نام اکران نیوز.
          </p>
        </div>
        <nav aria-label="دسته‌بندی‌های فوتر">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              {category.title}
            </Link>
          ))}
        </nav>
        <div className="footer-note">
          <Link href="/about">درباره ما</Link>
          <span>تماس با تحریریه</span>
          <span>سیاست اصلاح خبر</span>
          <a
            href="https://e-rasaneh.ir/Certificate/101661"
            target="_blank"
            rel="noreferrer"
          >
            مجوز پایگاه خبری
          </a>
          <ERasanehTrustSeal />
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© ۱۴۰۵ سینما نمایش</span>
        <span>دامنه اصلی: cinemanamayesh.ir</span>
      </div>
    </footer>
  );
}
