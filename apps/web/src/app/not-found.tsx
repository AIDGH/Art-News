import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found container-narrow">
      <span>۴۰۴</span>
      <h1>این صفحه پیدا نشد</h1>
      <p>ممکن است خبر جابه‌جا یا نشانی آن تغییر کرده باشد.</p>
      <Link href="/">بازگشت به صفحه اصلی</Link>
    </main>
  );
}
