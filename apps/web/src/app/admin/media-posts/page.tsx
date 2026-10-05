"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MediaUploader } from "@/components/admin/media-uploader";
import { adminFetch, type MediaAsset } from "@/lib/admin-api";
import type { MediaPost, MediaPostPage } from "@/lib/media-posts";
import "@/components/media-gallery.css";

const statuses = { DRAFT: "پیش‌نویس", PUBLISHED: "منتشرشده", ARCHIVED: "بایگانی" };
const empty = { title: "", description: "", kind: "PHOTOS" as MediaPost["kind"], status: "DRAFT" as MediaPost["status"] };

export default function MediaPostsPage() {
  const [result, setResult] = useState<MediaPostPage | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [cover, setCover] = useState<MediaAsset | null>(null);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [pickerKey, setPickerKey] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    adminFetch<MediaPostPage>(`/editorial/media-posts?page=${page}${filter ? `&status=${filter}` : ""}`)
      .then((data) => { if (active) setResult(data); })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : "دریافت محتوا انجام نشد."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filter, page, refresh]);

  const reload = () => { setLoading(true); setRefresh((value) => value + 1); };
  const edit = (post?: MediaPost) => {
    setEditing(post?.id ?? null); setError(""); setNotice(""); setOpen(true);
    setForm(post ? { title: post.title, description: post.description ?? "", kind: post.kind, status: post.status } : empty);
    setCover(post?.cover ?? null); setMedia(post?.items.map((item) => item.media) ?? []);
    setPickerKey((value) => value + 1);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const add = (asset: MediaAsset) => {
    if (media.some((item) => item.id === asset.id)) { setError("این فایل قبلاً اضافه شده است."); return; }
    setMedia((current) => [...current, asset]);
    if (!cover && asset.mimeType.startsWith("image/")) setCover(asset);
    setError(""); setPickerKey((value) => value + 1);
  };
  const move = (index: number, offset: number) => setMedia((current) => {
    const next = [...current];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    return next;
  });
  const save = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    if (uploading || busy) return;
    if (!cover || media.length === 0) { setError("کاور و دست‌کم یک فایل را انتخاب کنید."); return; }
    if (form.kind === "PHOTOS" && media.some((item) => item.mimeType.startsWith("video/"))) { setError("ویدیو را حذف کنید یا بخش فیلم را انتخاب کنید."); return; }
    if (form.kind === "VIDEOS" && !media.some((item) => item.mimeType.startsWith("video/"))) { setError("برای بخش فیلم دست‌کم یک ویدیو اضافه کنید."); return; }
    setBusy(true);
    try {
      await adminFetch(editing ? `/editorial/media-posts/${editing}` : "/editorial/media-posts", {
        method: editing ? "PUT" : "POST", body: JSON.stringify({ ...form, coverId: cover.id, mediaIds: media.map((item) => item.id) }),
      });
      setNotice(form.status === "PUBLISHED" ? "محتوا منتشر شد؛ در بخش عکس یا فیلم سایت قابل مشاهده است." : "محتوا ذخیره شد و در سایت عمومی نمایش داده نمی‌شود.");
      setOpen(false); reload();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "ذخیره انجام نشد."); }
    finally { setBusy(false); }
  };
  const action = async (post: MediaPost, status: MediaPost["status"] | "DELETE") => {
    if (status === "DELETE" && !window.confirm(`محتوای «${post.title}» حذف شود؟ فایل‌های گالری باقی می‌مانند.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await adminFetch(`/editorial/media-posts/${post.id}${status === "DELETE" ? "" : "/status"}`, {
        method: status === "DELETE" ? "DELETE" : "PATCH", ...(status === "DELETE" ? {} : { body: JSON.stringify({ status }) }),
      });
      setNotice(status === "DELETE" ? "محتوا حذف شد." : "وضعیت محتوا تغییر کرد.");
      if (status === "DELETE" && result?.data.length === 1 && page > 1) setPage(page - 1);
      reload();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "عملیات انجام نشد."); }
    finally { setBusy(false); }
  };

  return <div className="admin-page">
    <div className="admin-page-heading"><div><h1>عکس و ویدیو</h1><p>آلبوم عکس یا فیلم را با عنوان و کاور منتشر کنید.</p></div><button className="admin-primary-button" disabled={busy || uploading} onClick={() => edit()}>＋ محتوای جدید</button></div>
    <div className="admin-media-section-links"><Link href="/category/photos" target="_blank">مشاهده عکس‌ها</Link><Link href="/category/videos" target="_blank">مشاهده فیلم‌ها</Link></div>
    {error ? <div role="alert" className="admin-alert is-error">{error}</div> : null}
    {notice ? <div role="status" className="admin-alert is-success">{notice}</div> : null}
    {open ? <form className="admin-card admin-ad-form" onSubmit={save}>
      <h2 tabIndex={-1} ref={heading}>{editing ? "ویرایش محتوا" : "محتوای جدید"}</h2>
      <fieldset className="media-post-fields" disabled={busy || uploading}>
        <label className="admin-field"><span>عنوان</span><input required minLength={2} maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
        <div className="admin-field-grid">
          <label className="admin-field"><span>بخش سایت</span><select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as MediaPost["kind"] })}><option value="PHOTOS">عکس</option><option value="VIDEOS">فیلم</option></select></label>
          <label className="admin-field"><span>وضعیت انتشار</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as MediaPost["status"] })}>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
        <label className="admin-field"><span>توضیح (اختیاری)</span><textarea rows={3} maxLength={3000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        <h3>فایل‌های محتوا ({media.length.toLocaleString("fa-IR")} از ۷)</h3>
        <p className="admin-field-note">تصویر یا گیف تا ۸ مگابایت؛ ویدیوی MP4/WebM تا ۳۰ مگابایت. ترتیب زیر همان ترتیب ورق‌زدن در سایت است.</p>
        <ol className="admin-media-post-items">{media.map((asset, index) => <li key={asset.id}>
          <div className="admin-media-post-thumb">{asset.mimeType.startsWith("video/") ? <video src={asset.url} controls playsInline preload="metadata" /> : <Image src={asset.url} alt={asset.alt || form.title} width={120} height={100} unoptimized />}</div>
          <div><strong>{(index + 1).toLocaleString("fa-IR")} · {asset.mimeType.startsWith("video/") ? "ویدیو" : "عکس"}</strong><div className="admin-block-actions">
            <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>بالاتر</button><button type="button" disabled={index === media.length - 1} onClick={() => move(index, 1)}>پایین‌تر</button>
            {asset.mimeType.startsWith("image/") ? <button type="button" onClick={() => setCover(asset)}>{cover?.id === asset.id ? "کاور انتخاب‌شده" : "انتخاب به‌عنوان کاور"}</button> : null}
            <button type="button" className="admin-danger-button" onClick={() => setMedia((current) => current.filter((item) => item.id !== asset.id))}>برداشتن فایل</button>
          </div></div>
        </li>)}</ol>
        {media.length < 7 ? <MediaUploader key={`${pickerKey}-${form.kind}`} allowVideo={form.kind === "VIDEOS"} value={null} alt={form.title} credit="" onChange={add} onUploadingChange={setUploading} /> : null}
        <h3>تصویر کاور</h3>
        <p className="admin-field-note">در گرید سایت نمایش داده می‌شود؛ می‌توانید از عکس‌های بالا انتخاب کنید یا کاور جدا آپلود کنید.</p>
        <MediaUploader value={cover} alt={form.title} credit="" onChange={setCover} onUploadingChange={setUploading} />
        <div className="admin-block-actions"><button className="admin-primary-button" type="submit">{busy ? "در حال ذخیره…" : "ذخیره محتوا"}</button><button className="admin-secondary-button" type="button" onClick={() => setOpen(false)}>بستن فرم</button></div>
      </fieldset>
    </form> : null}
    <div className="admin-filter-bar admin-ad-filter"><select aria-label="فیلتر وضعیت محتوا" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); setLoading(true); }}><option value="">همه محتواها</option>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="admin-secondary-button" onClick={reload}>به‌روزرسانی</button></div>
    {loading ? <div className="admin-empty" role="status">در حال دریافت محتوا…</div> : !result?.data.length ? <div className="admin-empty">محتوایی در این بخش نیست.</div> : <>
      <div className="admin-ad-list">{result.data.map((post) => <article className="admin-card admin-ad-item" key={post.id}>
        <div className="admin-ad-preview"><Image src={post.cover.url} alt={post.cover.alt || post.title} width={600} height={400} unoptimized /></div>
        <div className="admin-ad-details"><h2>{post.title}</h2><p>{post.kind === "PHOTOS" ? "عکس" : "فیلم"} · {statuses[post.status]} · {post.items.length.toLocaleString("fa-IR")} فایل</p>
          <div className="admin-block-actions"><button disabled={busy} onClick={() => edit(post)}>ویرایش</button><button disabled={busy} onClick={() => void action(post, post.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED")}>{post.status === "PUBLISHED" ? "توقف انتشار" : "انتشار"}</button><button disabled={busy} className="admin-danger-button" onClick={() => void action(post, "DELETE")}>حذف</button></div>
        </div>
      </article>)}</div>
      <div className="admin-block-actions"><button disabled={page === 1} onClick={() => { setPage(page - 1); setLoading(true); }}>صفحه قبل</button><span>صفحه {page.toLocaleString("fa-IR")}</span><button disabled={!result.meta.hasMore} onClick={() => { setPage(page + 1); setLoading(true); }}>صفحه بعد</button></div>
    </>}
  </div>;
}
