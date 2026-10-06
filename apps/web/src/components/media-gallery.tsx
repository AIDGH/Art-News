"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
  const close = useCallback(() => setOpenIndex(null), []);
  return <section className="media-gallery" aria-label={kind === "PHOTOS" ? "آلبوم عکس‌ها" : "ویدیوها"}>
    <div className="media-cover-grid">{result.data.map((post, index) => <div className="media-cover-entry" key={post.id}><button className="media-cover-card" type="button" onClick={() => setOpenIndex(index)} aria-label={`نمایش ${post.title}`}>
      <span className="media-cover-image"><Image src={post.cover.url} alt={post.cover.alt || post.title} fill unoptimized sizes="(max-width: 760px) 45vw, (max-width: 1100px) 30vw, 280px" />
        <span className="media-cover-badge"><MediaIcon video={post.kind === "VIDEOS"} /><span>{post.items.length.toLocaleString("fa-IR")}</span></span>
      </span><span className="media-cover-title">{post.title}</span>
    </button><SourceLink post={post} /></div>)}</div>
    {!result.data.length && !error ? <p className="media-gallery-empty">هنوز {kind === "PHOTOS" ? "آلبوم عکسی" : "ویدیویی"} منتشر نشده است.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {result.meta.hasMore || error ? <button className="media-load-more" disabled={loading} onClick={() => void loadMore()}>{loading ? "در حال دریافت…" : error ? "تلاش دوباره" : "نمایش بیشتر"}</button> : null}
    {openIndex !== null ? createPortal(<ReelsViewer posts={result.data} start={openIndex} onClose={close} hasMore={result.meta.hasMore} loading={loading} error={error} onMore={loadMore} />, document.body) : null}
  </section>;
}

function ReelsViewer({ posts, start, onClose, hasMore, loading, error, onMore }: { posts: MediaPost[]; start: number; onClose: () => void; hasMore: boolean; loading: boolean; error: string; onMore: () => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(start);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const modal = dialog.current;
    modal?.showModal();
    const element = feed.current;
    if (element) element.scrollTop = start * element.clientHeight;
    const resize = new ResizeObserver(() => {
      if (element) {
        const current = Number(element.dataset.active ?? start);
        element.scrollTop = current * element.clientHeight;
      }
    });
    if (element) resize.observe(element);
    return () => { resize.disconnect(); modal?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [start]);

  const navigate = (next: number) => {
    const index = Math.max(0, Math.min(posts.length - 1, next));
    feed.current?.scrollTo({ top: index * feed.current.clientHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <dialog className="reels-dialog" ref={dialog} aria-label="نمایش عکس و ویدیو" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); navigate(active + (event.key === "ArrowDown" ? 1 : -1)); }
  }}>
    <div className="reels-topbar"><span>سینما نمایش</span><button autoFocus type="button" onClick={onClose} aria-label="بستن نمایش">×</button></div>
    <div className="reels-feed" ref={feed} data-active={active} onScroll={(event) => {
      const element = event.currentTarget;
      setActive(Math.min(posts.length - 1, Math.max(0, Math.round(element.scrollTop / element.clientHeight))));
    }}>
      {posts.map((post, index) => <ReelSlide key={post.id} post={post} active={active === index} muted={muted} setMuted={setMuted} />)}
    </div>
    <div className="reels-feed-controls"><button type="button" aria-label="محتوای قبلی" disabled={active === 0} onClick={() => navigate(active - 1)}>↑</button><span>{(active + 1).toLocaleString("fa-IR")} از {posts.length.toLocaleString("fa-IR")}</span><button type="button" aria-label="محتوای بعدی" disabled={active === posts.length - 1} onClick={() => navigate(active + 1)}>↓</button>
      {active === posts.length - 1 && hasMore ? <button disabled={loading} onClick={() => void onMore()}>{loading ? "…" : "بیشتر"}</button> : null}
      {error ? <span role="alert">دریافت انجام نشد</span> : null}
    </div>
  </dialog>;
}

function ReelSlide({ post, active, muted, setMuted }: { post: MediaPost; active: boolean; muted: boolean; setMuted: (value: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const asset = post.items[index].media;
  const isVideo = asset.mimeType.startsWith("video/");

  useEffect(() => {
    const player = video.current;
    if (active && player) void player.play().catch(() => undefined);
    const visibility = () => { if (document.hidden) player?.pause(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { player?.pause(); document.removeEventListener("visibilitychange", visibility); };
  }, [active, index]);
  useEffect(() => { if (video.current) video.current.playbackRate = speed; }, [active, index, speed]);
  const change = (next: number) => {
    const target = Math.max(0, Math.min(post.items.length - 1, next));
    if (target === index) return;
    setIndex(target); setProgress(0); setFailed(false); setSpeed(1);
  };
  const togglePlay = () => {
    const player = video.current;
    if (player?.paused) void player.play().catch(() => setFailed(true));
    else player?.pause();
  };
  return <article className="reel-slide" aria-hidden={!active} inert={!active}>
    <div className="reel-stage">
      <button className="reel-surface" type="button" aria-label={isVideo ? playing ? "مکث ویدیو" : "پخش ویدیو" : post.title}
        onPointerDown={(event) => { gesture.current = { x: event.clientX, y: event.clientY }; suppressClick.current = false; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerUp={(event) => {
          const start = gesture.current; gesture.current = null;
          if (!start) return;
          const x = event.clientX - start.x; const y = event.clientY - start.y;
          suppressClick.current = Math.abs(x) > 10 || Math.abs(y) > 10;
          if (Math.abs(x) > 44 && Math.abs(x) > Math.abs(y)) change(index + (x > 0 ? 1 : -1));
        }}
        onPointerCancel={() => { gesture.current = null; suppressClick.current = true; }}
        onClick={() => { if (!suppressClick.current && isVideo) togglePlay(); suppressClick.current = false; }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(index + (event.key === "ArrowLeft" ? 1 : -1)); }
        }}>
        {active && isVideo ? <video key={asset.id} ref={video} src={asset.url} poster={post.cover.url} playsInline muted={muted} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} onTimeUpdate={(event) => { const player = event.currentTarget; setProgress(player.duration ? player.currentTime / player.duration : 0); }} onEnded={() => { if (index < post.items.length - 1) change(index + 1); }} />
          : <Image src={active ? asset.url : post.cover.url} alt={asset.alt || post.title} fill unoptimized sizes="(max-width: 760px) 100vw, 600px" draggable={false} />}
      </button>
      {post.items.length > 1 ? <div className="reel-album-controls"><button type="button" aria-label="فایل قبلی" disabled={index === 0} onClick={() => change(index - 1)}>→</button><span>{(index + 1).toLocaleString("fa-IR")} از {post.items.length.toLocaleString("fa-IR")}</span><button type="button" aria-label="فایل بعدی" disabled={index === post.items.length - 1} onClick={() => change(index + 1)}>←</button></div> : null}
      {failed ? <p className="reel-error" role="alert">پخش فایل ممکن نشد؛ اتصال یا فرمت ویدیو را بررسی کنید.</p> : null}
    </div>
    <div className="reel-caption">
      {isVideo ? <div className="reel-player-controls">
        <button type="button" onClick={togglePlay}>{playing ? "مکث" : "پخش"}</button><button type="button" onClick={() => setMuted(!muted)}>{muted ? "روشن‌کردن صدا" : "بی‌صدا"}</button>
        <button type="button" aria-label="سرعت پخش" onClick={() => { const next = speed === 1 ? 2 : 1; setSpeed(next); if (video.current) video.current.playbackRate = next; }}>{speed}×</button>
        <input type="range" min={0} max={100} value={Math.round(progress * 100)} aria-label="زمان ویدیو" onChange={(event) => { const player = video.current; if (player && Number.isFinite(player.duration)) { player.currentTime = Number(event.target.value) / 100 * player.duration; setProgress(Number(event.target.value) / 100); } }} />
      </div> : null}
      <h2>{post.title}</h2>
      {post.description ? <p>{post.description}</p> : null}
      <SourceLink post={post} />
      {asset.credit ? <small>{asset.credit}</small> : null}
    </div>
  </article>;
}
