"use client";

import Image from "next/image";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type OrderItem = { id: string; title: string; imageUrl: string | null; status: string; placement?: string };
const labels: Record<string, string> = { PUBLISHED: "منتشرشده", SCHEDULED: "زمان‌بندی‌شده", DRAFT: "پیش‌نویس", IN_REVIEW: "در انتظار بررسی", ARCHIVED: "بایگانی", ACTIVE: "فعال", EXPIRED: "پایان‌یافته", DISABLED: "غیرفعال", ALL: "همه جایگاه‌ها", HOME: "صفحه اصلی", ARTICLE: "صفحات خبر", CATEGORY: "دسته‌بندی‌ها" };

export function DisplayOrderEditor({ title, path, hint, onSaved }: { title: string; path: string; hint: string; onSaved?: () => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = async () => {
    setOpen(true); setBusy(true); setError(""); setNotice("");
    try { const response = await adminFetch<{ data: OrderItem[] }>(path, { cache: "no-store" }); setItems(response.data); setDirty(false); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "دریافت فهرست انجام نشد."); }
    finally { setBusy(false); }
  };
  const move = (id: string, target: number) => {
    const source = items.findIndex((item) => item.id === id);
    if (busy || source < 0 || target < 0 || target >= items.length || source === target) return;
    const next = [...items]; next.splice(target, 0, next.splice(source, 1)[0]); setItems(next); setDirty(true); setNotice("");
  };
  const save = async () => {
    setBusy(true); setError(""); setNotice("");
    try { const response = await adminFetch<{ data: OrderItem[] }>(path, { method: "PUT", body: JSON.stringify({ ids: items.map((item) => item.id) }) }); setItems(response.data); setDirty(false); setNotice("چینش ذخیره شد."); onSaved?.(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "ذخیره چینش انجام نشد."); }
    finally { setBusy(false); }
  };
  return <section className="admin-card admin-order-editor">
    <div className="admin-block-heading"><h2>{title}</h2><button type="button" className="admin-secondary-button" disabled={busy} onClick={() => open ? setOpen(false) : void load()}>{open ? "بستن چینش" : "مشاهده و جابه‌جایی"}</button></div>
    {open ? <>
      <p className="admin-field-note">{hint} روی گوشی با دکمه‌های بالا/پایین و روی دسکتاپ با کشیدن کارت هم جابه‌جا کنید؛ سپس «ذخیره چینش» را بزنید.</p>
      {error ? <p role="alert" className="admin-alert is-error">{error}</p> : null}
      {notice ? <p role="status" className="admin-alert is-success">{notice}</p> : null}
      <ol className="admin-order-list" aria-label={title}>{items.map((item, index) => <li key={item.id} draggable={!busy} className={draggedId === item.id ? "is-dragging" : ""}
        onDragStart={(event) => { setDraggedId(item.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", item.id); }} onDragEnd={() => setDraggedId(null)}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); if (draggedId) move(draggedId, index); setDraggedId(null); }}>
        <span className="admin-order-position">{(index + 1).toLocaleString("fa-IR")}</span>
        {item.imageUrl ? <Image src={item.imageUrl} alt="" width={64} height={48} unoptimized draggable={false} /> : null}
        <div className="admin-order-copy"><strong>{item.title}</strong><small>{labels[item.status] ?? item.status}{item.placement ? ` · ${labels[item.placement]}` : ""}</small></div>
        <div className="admin-order-controls"><button type="button" aria-label={`بالا بردن ${item.title}`} disabled={busy || index === 0} onClick={() => move(item.id, index - 1)}>↑</button><button type="button" aria-label={`پایین بردن ${item.title}`} disabled={busy || index === items.length - 1} onClick={() => move(item.id, index + 1)}>↓</button></div>
      </li>)}</ol>
      {!items.length && !busy && !error ? <p>هنوز موردی برای چینش نیست.</p> : null}
      <div className="admin-block-actions"><button type="button" className="admin-primary-button" disabled={busy || !dirty} onClick={() => void save()}>{busy ? "در حال دریافت/ذخیره…" : "ذخیره چینش"}</button><button type="button" className="admin-secondary-button" disabled={busy} onClick={() => void load()}>دریافت دوباره</button></div>
    </> : null}
  </section>;
}
