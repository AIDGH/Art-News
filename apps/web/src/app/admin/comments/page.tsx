"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  article: { title: string; slug: string };
};

const labels = { PENDING: "در انتظار بررسی", APPROVED: "تأییدشده", REJECTED: "ردشده" };

export default function AdminCommentsPage() {
  const [items, setItems] = useState<Comment[]>([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    adminFetch<{ data: Comment[] }>(`/editorial/comments${status ? `?status=${status}` : ""}`)
      .then(({ data }) => { if (active) setItems(data); })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : "دریافت نظرها ممکن نشد"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [status]);

  async function moderate(id: string, next: "APPROVED" | "REJECTED") {
    setBusy(id); setError("");
    try {
      await adminFetch(`/editorial/comments/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      if (status) setItems((current) => current.filter((item) => item.id !== id));
      else setItems((current) => current.map((item) => item.id === id ? { ...item, status: next } : item));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "تغییر وضعیت نظر ممکن نشد"); }
    finally { setBusy(null); }
  }

  return <div className="admin-page">
    <div className="admin-page-heading"><div><span>مدیریت محتوا</span><h1>نظرها</h1><p>نظرهای تازه پس از تأیید در خبر نمایش داده می‌شوند.</p></div></div>
    <div className="admin-filter-bar admin-comment-filter"><select value={status} onChange={(event) => { setStatus(event.target.value); setLoading(true); setError(""); }}>
      <option value="PENDING">در انتظار بررسی</option><option value="APPROVED">تأییدشده</option><option value="REJECTED">ردشده</option><option value="">همه نظرها</option>
    </select></div>
    {error ? <div className="admin-alert is-error">{error}</div> : null}
    {loading ? <div className="admin-empty">در حال دریافت نظرها…</div> : items.length === 0 ? <div className="admin-empty">نظری در این بخش نیست.</div>
      : <div className="admin-comment-list">{items.map((item) => <article className="admin-comment-card" key={item.id}>
        <div><strong>{item.authorName}</strong><span>{labels[item.status]}</span></div>
        <Link href={`/articles/${item.article.slug}`} target="_blank">{item.article.title}</Link>
        <p>{item.body}</p>
        <small>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</small>
        <div className="admin-comment-actions">
          {item.status !== "APPROVED" ? <button type="button" disabled={busy === item.id} onClick={() => moderate(item.id, "APPROVED")}>تأیید و انتشار</button> : null}
          {item.status !== "REJECTED" ? <button type="button" disabled={busy === item.id} onClick={() => moderate(item.id, "REJECTED")}>رد نظر</button> : null}
        </div>
      </article>)}</div>}
  </div>;
}
