"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MediaPost, MediaPostPage } from "@/lib/media-posts";
import "./media-gallery.css";

function MediaIcon({ video }: { video: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{video ? <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m10 8 6 4-6 4Z" /></> : <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>}</svg>;
}

function SourceLink({ post }: { post: MediaPost }) {
  return post.targetUrl ? <a className="media-post-source" href={post.targetUrl} target="_blank" rel="noopener noreferrer" aria-label={`مشاهده پست اصلی ${post.title}`}>
    مشاهده پست اصلی <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></svg>
  </a> : null;
}

export function MediaGallery({ initial, kind, failed = false }: { initial: MediaPostPage; kind: MediaPost["kind"]; failed?: boolean }) {
  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(failed ? "دریافت محتوا ممکن نشد. دوباره تلاش کنید." : "");
  const loadMore = async () => {
    setLoading(true); setError("");
    try {
      const page = result.data.length ? result.meta.page + 1 : 1;
      const response = await fetch(`/api/v1/media-posts?kind=${kind}&page=${page}`, { cache: "no-store" });
      if (!response.ok) throw new Error("دریافت محتوا ممکن نشد. دوباره تلاش کنید.");
      const next = await response.json() as MediaPostPage;
      setResult((current) => ({ ...next, data: [...new Map([...current.data, ...next.data].map((item) => [item.id, item])).values()] }));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "دریافت محتوا انجام نشد."); }
    finally { setLoading(false); }
  };
  return <section className="media-gallery" aria-label={kind === "PHOTOS" ? "آلبوم عکس‌ها" : "ویدیوها"}>
    <div className="media-cover-grid">{result.data.map((post) => {
      const content = <>
      <span className={`media-cover-image${post.kind === "VIDEOS" ? " media-cover-image-video" : ""}`}><Image src={post.cover.url} alt={post.cover.alt || post.title} fill unoptimized sizes="(max-width: 760px) 45vw, (max-width: 1100px) 30vw, 280px" />
        <span className="media-cover-badge"><MediaIcon video={post.kind === "VIDEOS"} /><span>{post.items.length.toLocaleString("fa-IR")}</span></span>
      </span><span className="media-cover-title">{post.title}</span></>;
      return <div className="media-cover-entry" key={post.id}>
        <Link className="media-cover-card" href={`/articles/${post.id}`} aria-label={`نمایش ${post.title}`}>{content}</Link>
        <SourceLink post={post} />
      </div>;
    })}</div>
    {!result.data.length && !error ? <p className="media-gallery-empty">هنوز {kind === "PHOTOS" ? "آلبوم عکسی" : "ویدیویی"} منتشر نشده است.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {result.meta.hasMore || error ? <button className="media-load-more" disabled={loading} onClick={() => void loadMore()}>{loading ? "در حال دریافت…" : error ? "تلاش دوباره" : "نمایش بیشتر"}</button> : null}
  </section>;
}
