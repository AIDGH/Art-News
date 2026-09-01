import Link from "next/link";
import { categories } from "@/lib/news";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong className="footer-brand">هنرنامه</strong>
          <p>
            رسانه‌ای مستقل برای خبر، گفت‌وگو و تحلیل هنر. تمام محتوای این نسخه
            نمایشی است.
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
          <span>درباره ما</span>
          <span>تماس با تحریریه</span>
          <span>سیاست اصلاح خبر</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© ۱۴۰۵ هنرنامه</span>
        <span>قالب آزمایشی محصول</span>
      </div>
    </footer>
  );
}
