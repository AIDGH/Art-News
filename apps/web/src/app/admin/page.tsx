"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminFetch, type AdminArticle, type AdminCategory } from "@/lib/admin-api";

const statusLabels: Record<AdminArticle["status"], string> = {
  DRAFT: "پیش‌نویس",
  IN_REVIEW: "در انتظار بررسی",
  SCHEDULED: "زمان‌بندی‌شده",
  PUBLISHED: "منتشرشده",
  ARCHIVED: "بایگانی",
};

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ pageSize: "100" });
    if (appliedQuery) params.set("query", appliedQuery);
    if (status) params.set("status", status);
    if (category) params.set("category", category);
    Promise.all([
      adminFetch<{ data: AdminArticle[] }>(`/editorial/articles?${params}`),
      adminFetch<{ data: AdminCategory[] }>("/editorial/categories"),
    ])
      .then(([articleResponse, categoryResponse]) => {
        if (cancelled) return;
        setArticles(articleResponse.data);
        setCategories(categoryResponse.data);
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "دریافت اطلاعات ممکن نشد");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [appliedQuery, category, status]);

  const counts = useMemo(() => ({
    all: articles.length,
    published: articles.filter((article) => article.status === "PUBLISHED").length,
    draft: articles.filter((article) => article.status === "DRAFT").length,
    review: articles.filter((article) => article.status === "IN_REVIEW").length,
  }), [articles]);

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><span>مدیریت محتوا</span><h1>خبرها</h1><p>همه خبرهای سایت از این فهرست مدیریت می‌شوند.</p></div>
        <Link className="admin-primary-button" href="/admin/articles/new">＋ ثبت خبر جدید</Link>
      </div>
      <section className="admin-stat-grid" aria-label="آمار خبرها">
        <div><span>همه نتایج</span><strong>{counts.all.toLocaleString("fa-IR")}</strong></div>
        <div><span>منتشرشده</span><strong>{counts.published.toLocaleString("fa-IR")}</strong></div>
        <div><span>پیش‌نویس</span><strong>{counts.draft.toLocaleString("fa-IR")}</strong></div>
        <div><span>در انتظار بررسی</span><strong>{counts.review.toLocaleString("fa-IR")}</strong></div>
      </section>
      <form className="admin-filter-bar" onSubmit={(event) => { event.preventDefault(); setLoading(true); setError(""); setAppliedQuery(query.trim()); }}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجوی تیتر یا شناسه خبر…" />
        <select value={status} onChange={(event) => { setLoading(true); setError(""); setStatus(event.target.value); }}>
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        <select value={category} onChange={(event) => { setLoading(true); setError(""); setCategory(event.target.value); }}>
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((item) => <option value={item.slug} key={item.id}>{item.title}</option>)}
        </select>
        <button type="submit">جست‌وجو</button>
      </form>
      {error ? <div className="admin-alert is-error">{error}</div> : null}
      <section className="admin-table-card">
        {loading ? <div className="admin-empty">در حال دریافت خبرها…</div> : articles.length === 0 ? <div className="admin-empty">خبری با این فیلتر پیدا نشد.</div> : (
          <div className="admin-table-scroll"><table><thead><tr><th>خبر</th><th>دسته‌بندی</th><th>وضعیت</th><th>آخرین تغییر</th><th /></tr></thead><tbody>
            {articles.map((article) => <tr key={article.id}>
              <td><strong>{article.title}</strong><small>{article.slug}</small></td>
              <td>{article.category.title}</td>
              <td><span className={`admin-status is-${article.status.toLowerCase()}`}>{statusLabels[article.status]}</span></td>
              <td>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(article.updatedAt))}</td>
              <td><Link href={`/admin/articles/${article.id}/edit`}>ویرایش</Link></td>
            </tr>)}
          </tbody></table></div>
        )}
      </section>
    </div>
  );
}
