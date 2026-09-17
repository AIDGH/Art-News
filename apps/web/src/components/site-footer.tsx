import Link from "next/link";
import { categories } from "@/lib/news";
import { ERasanehTrustSeal } from "@/components/e-rasaneh-trust-seal";

export function SiteFooter({ description }: { description: string }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <strong className="footer-brand">سینما نمایش</strong>
          <p>{description}</p>
          <div className="footer-note">
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
        <nav aria-label="دسته‌بندی‌های فوتر">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              {category.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© ۱۴۰۵ سینما نمایش</span>
      </div>
    </footer>
  );
}
