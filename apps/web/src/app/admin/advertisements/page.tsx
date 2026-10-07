"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { adminFetch, type AdminAdvertisement, type MediaAsset } from "@/lib/admin-api";
import { MediaUploader } from "@/components/admin/media-uploader";
import { DisplayOrderEditor } from "@/components/admin/display-order-editor";

const statusLabels = { ACTIVE: "فعال", SCHEDULED: "زمان‌بندی‌شده", EXPIRED: "پایان‌یافته", DISABLED: "غیرفعال" };
const placements = { ALL: "همه جایگاه‌ها", HOME: "صفحه اصلی", ARTICLE: "صفحات خبر", CATEGORY: "صفحات دسته‌بندی" };
const emptyForm = { title: "", text: "", targetUrl: "", placement: "ALL" as AdminAdvertisement["placement"], enabled: true, startsAt: "", endsAt: "" };

function localDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function AdvertisementsPage() {
  const [items, setItems] = useState<AdminAdvertisement[]>([]);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [media, setMedia] = useState<MediaAsset | null>(null);
  const [alt, setAlt] = useState("");

  useEffect(() => {
    let active = true;
    adminFetch<{ data: AdminAdvertisement[] }>(`/editorial/advertisements${filter ? `?status=${filter}` : ""}`)
      .then(({ data }) => { if (active) setItems(data); })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : "دریافت تبلیغات انجام نشد"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, refresh]);

  const reload = () => { setLoading(true); setRefresh((value) => value + 1); };
  const edit = (ad?: AdminAdvertisement) => {
    setEditing(ad?.id ?? null); setFormOpen(true); setError(""); setNotice("");
    setMedia(ad?.media ?? null); setAlt(ad?.media.alt ?? "");
    setForm(ad ? { title: ad.title, text: ad.text ?? "", targetUrl: ad.targetUrl ?? "", placement: ad.placement, enabled: ad.enabled, startsAt: localDate(ad.startsAt), endsAt: localDate(ad.endsAt) } : emptyForm);
  };
  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if (!media) throw new Error("فایل تبلیغ را انتخاب کنید.");
      if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) throw new Error("زمان پایان باید بعد از شروع باشد.");
      await adminFetch(`/editorial/media/${media.id}`, { method: "PATCH", body: JSON.stringify({ alt: alt.trim() || form.title }) });
      await adminFetch(editing ? `/editorial/advertisements/${editing}` : "/editorial/advertisements", {
        method: editing ? "PATCH" : "POST", body: JSON.stringify({
          ...form, mediaId: media.id, targetUrl: form.targetUrl.trim() || null,
          startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
          endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
        }),
      });
      setNotice("تبلیغ ذخیره شد؛ در بازهٔ تعیین‌شده در سایت نمایش داده می‌شود."); setFormOpen(false); reload();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "ذخیره انجام نشد"); }
    finally { setBusy(false); }
  };
  const action = async (ad: AdminAdvertisement, operation: "disable" | "activate" | "delete") => {
    if (operation === "delete" && !window.confirm(`تبلیغ «${ad.title}» حذف شود؟`)) return;
    if (operation === "activate" && !window.confirm("این تبلیغ از همین حالا فعال شود؟ اگر زمان آن تمام شده، پایان نمایش حذف می‌شود؛ می‌توانید تاریخ تازه را در ویرایش تعیین کنید.")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await adminFetch(`/editorial/advertisements/${ad.id}${operation === "activate" ? "/activate" : ""}`, {
        method: operation === "delete" ? "DELETE" : operation === "activate" ? "POST" : "PATCH",
        ...(operation === "disable" ? { body: JSON.stringify({ enabled: false }) } : {}),
      });
      setNotice(operation === "delete" ? "تبلیغ حذف شد." : operation === "activate" ? "تبلیغ فعال شد." : "تبلیغ غیرفعال شد."); reload();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "عملیات انجام نشد"); }
    finally { setBusy(false); }
  };

  return <div className="admin-page">
    <div className="admin-page-heading"><div><span>مدیریت نمایش</span><h1>تبلیغات</h1><p>تصویر، گیف یا ویدیو را همراه لینک و زمان نمایش ثبت کنید.</p></div><button className="admin-primary-button" disabled={busy} onClick={() => edit()}>＋ تبلیغ جدید</button></div>
    {error ? <div className="admin-alert is-error">{error}</div> : null}
    <DisplayOrderEditor title="چینش تبلیغات" path="/editorial/advertisements/display-order" hint="تمام تبلیغات با وضعیت و جایگاه‌شان نمایش داده می‌شوند؛ فقط تبلیغات فعالِ هر جایگاه در سایت دیده می‌شوند. تبلیغ جدید به انتهای فهرست اضافه می‌شود." onSaved={reload} />
    {notice ? <div className="admin-alert is-success">{notice}</div> : null}
    {formOpen ? <form className="admin-card admin-ad-form" onSubmit={save}>
      <h2>{editing ? "ویرایش تبلیغ" : "تبلیغ جدید"}</h2>
      <label className="admin-field"><span>عنوان تبلیغ</span><input required minLength={2} maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
      <MediaUploader allowVideo value={media} alt={alt} credit="" onChange={(value) => { setMedia(value); setAlt(value.alt); }} />
      <p className="admin-field-note">تصویر و گیف تا ۸ مگابایت؛ ویدیوی MP4 یا WebM تا ۳۰ مگابایت.</p>
      <label className="admin-field"><span>توضیح فایل برای دسترس‌پذیری</span><input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="در صورت خالی‌بودن از عنوان استفاده می‌شود" /></label>
      <div className="admin-field-grid">
        <label className="admin-field"><span>لینک مقصد (اختیاری)</span><input dir="ltr" type="url" maxLength={2000} placeholder="https://…" value={form.targetUrl} onChange={(event) => setForm({ ...form, targetUrl: event.target.value })} /></label>
        <label className="admin-field"><span>محل نمایش</span><select value={form.placement} onChange={(event) => setForm({ ...form, placement: event.target.value as AdminAdvertisement["placement"] })}>{Object.entries(placements).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="admin-field"><span>شروع نمایش</span><input type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} /><small>خالی: از همین حالا</small></label>
        <label className="admin-field"><span>پایان نمایش</span><input type="datetime-local" value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} /><small>خالی: بدون تاریخ پایان</small></label>
      </div>
      <label className="admin-field"><span>نوشتهٔ همراه (اختیاری)</span><textarea rows={3} maxLength={1200} value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} /></label>
      <label className="admin-check"><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} /><span>نمایش تبلیغ در بازهٔ تعیین‌شده فعال باشد</span></label>
      <div className="admin-block-actions"><button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "در حال ذخیره…" : "ذخیره تبلیغ"}</button><button className="admin-secondary-button" type="button" disabled={busy} onClick={() => setFormOpen(false)}>بستن فرم</button></div>
    </form> : null}
    <div className="admin-filter-bar admin-ad-filter"><select aria-label="فیلتر وضعیت تبلیغات" value={filter} onChange={(event) => { setFilter(event.target.value); setLoading(true); }}><option value="">همه تبلیغات</option><option value="active">فعال</option><option value="inactive">غیرفعال، زمان‌بندی‌شده و پایان‌یافته</option></select><button className="admin-secondary-button" onClick={reload}>به‌روزرسانی</button></div>
    {loading ? <div className="admin-empty">در حال دریافت تبلیغات…</div> : items.length === 0 ? <div className="admin-empty">تبلیغی در این بخش نیست.</div> : <div className="admin-ad-list">{items.map((ad) => <article className="admin-card admin-ad-item" key={ad.id}>
      <div className="admin-ad-preview">{ad.media.mimeType.startsWith("video/") ? <video src={ad.media.url} controls playsInline preload="none" /> : <Image src={ad.media.url} alt={ad.media.alt || ad.title} width={600} height={300} unoptimized />}</div>
      <div className="admin-ad-details"><div className="admin-block-heading"><h2>{ad.title}</h2><span className={`admin-ad-status${ad.effectiveStatus === "ACTIVE" ? " is-active" : ""}`}>{statusLabels[ad.effectiveStatus]}</span></div>
        <p>{placements[ad.placement]}</p><small>شروع: {ad.startsAt ? new Date(ad.startsAt).toLocaleString("fa-IR") : "فوری"} · پایان: {ad.endsAt ? new Date(ad.endsAt).toLocaleString("fa-IR") : "بدون پایان"}</small>
        {ad.text ? <p>{ad.text}</p> : null}
        {ad.targetUrl ? <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="admin-ad-url">{ad.targetUrl}</a> : null}
        <div className="admin-block-actions"><button type="button" disabled={busy} onClick={() => edit(ad)}>ویرایش</button>{ad.effectiveStatus !== "ACTIVE" ? <button type="button" disabled={busy} onClick={() => void action(ad, "activate")}>فعال‌سازی اکنون</button> : null}{ad.enabled ? <button type="button" disabled={busy} onClick={() => void action(ad, "disable")}>غیرفعال‌سازی</button> : null}<button type="button" disabled={busy} className="admin-danger-button" onClick={() => void action(ad, "delete")}>حذف</button></div>
      </div>
    </article>)}</div>}
  </div>;
}
