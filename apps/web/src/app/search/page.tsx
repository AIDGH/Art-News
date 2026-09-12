import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { fetchArticles } from "@/lib/api";

export const metadata: Metadata = {
  title: "جست‌وجو",
  description: "جست‌وجو در خبرها و روایت‌های سینما نمایش",
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await fetchArticles({ query, pageSize: 30 }) : [];

  return (
    <main className="search-page container">
      <header>
        <span>آرشیو سینما نمایش</span>
        <h1>جست‌وجو</h1>
        <p>نام فیلم، سینماگر، موضوع یا بخشی از تیتر را بنویسید.</p>
      </header>
      <form className="search-form" action="/search" method="get">
        <label htmlFor="site-search">عبارت جست‌وجو</label>
        <div>
          <input
            id="site-search"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="مثلاً نقاشی، سینما یا معماری"
            autoComplete="off"
          />
          <button type="submit">جست‌وجو</button>
        </div>
      </form>
      <section className="search-results" aria-live="polite">
        {query ? (
          <div className="search-summary">
            <strong>{results.length.toLocaleString("fa-IR")}</strong>
            <span>نتیجه برای «{q}»</span>
          </div>
        ) : (
          <p className="search-guidance">برای دیدن نتیجه، یک عبارت وارد کنید.</p>
        )}
        {results.map((article) => (
          <ArticleCard article={article} variant="horizontal" key={article.slug} />
        ))}
        {query && results.length === 0 ? (
          <p className="search-guidance">
            نتیجه‌ای پیدا نشد؛ عبارت کوتاه‌تر یا نام یک دسته را امتحان کنید.
          </p>
        ) : null}
      </section>
    </main>
  );
}
