"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaPost, MediaPostPage } from "@/lib/media-posts";
import "./media-gallery.css";

function MediaIcon({ video }: { video: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      {video ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="m10 8 6 4-6 4Z" />
        </>
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8" cy="8" r="1.5" />
          <path d="m3 17 5-5 4 4 4-6 5 7" />
        </>
      )}
    </svg>
  );
}

function SourceLink({ post }: { post: MediaPost }) {
  return post.targetUrl ? (
    <a
      className="media-post-source"
      href={post.targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`مشاهده پست اصلی ${post.title}`}
    >
      مشاهده پست اصلی{" "}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
      </svg>
    </a>
  ) : null;
}

export function MediaGallery({
  initial,
  kind,
  failed = false,
}: {
  initial: MediaPostPage;
  kind: MediaPost["kind"];
  failed?: boolean;
}) {
  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(failed ? "دریافت محتوا ممکن نشد. دوباره تلاش کنید." : "");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const loadMore = async () => {
    setLoading(true);
    setError("");
    try {
      const page = result.data.length ? result.meta.page + 1 : 1;
      const response = await fetch(`/api/v1/media-posts?kind=${kind}&page=${page}`, { cache: "no-store" });
      if (!response.ok) throw new Error("دریافت محتوا ممکن نشد. دوباره تلاش کنید.");
      const next = (await response.json()) as MediaPostPage;
      setResult((current) => ({
        ...next,
        data: [...new Map([...current.data, ...next.data].map((item) => [item.id, item])).values()],
      }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "دریافت محتوا انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section className="media-gallery" aria-label={kind === "PHOTOS" ? "آلبوم عکس‌ها" : "ویدیوها"}>
      <div className="media-cover-grid">
        {result.data.map((post, index) => {
          const isVideo = post.kind === "VIDEOS" || kind === "VIDEOS";
          return (
            <div className="media-cover-entry" key={post.id}>
              {isVideo ? (
                <Link
                  href={`/articles/${post.id}`}
                  className="media-cover-card w-full text-right block group"
                  aria-label={`مشاهده ${post.title}`}
                >
                  <span
                    className={`media-cover-image relative block overflow-hidden rounded-lg bg-neutral-900 ${
                      isVideo ? "aspect-video" : "aspect-[3/4]"
                    }`}
                  >
                    <Image
                      src={post.cover.url}
                      alt={post.cover.alt || post.title}
                      fill
                      unoptimized
                      className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 760px) 45vw, (max-width: 1100px) 30vw, 280px"
                    />
                    <span className="media-cover-badge">
                      <MediaIcon video={isVideo} />
                      <span>{post.items.length.toLocaleString("fa-IR")}</span>
                    </span>
                  </span>
                  <span className="media-cover-title block mt-2 text-slate-900 font-bold text-sm md:text-base line-clamp-3 md:line-clamp-4 leading-relaxed group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </span>
                </Link>
              ) : (
                <button
                  className="media-cover-card w-full text-right block group"
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`نمایش ${post.title}`}
                >
                  <span
                    className={`media-cover-image relative block overflow-hidden rounded-lg bg-neutral-900 ${
                      isVideo ? "aspect-video" : "aspect-[3/4]"
                    }`}
                  >
                    <Image
                      src={post.cover.url}
                      alt={post.cover.alt || post.title}
                      fill
                      unoptimized
                      className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 760px) 45vw, (max-width: 1100px) 30vw, 280px"
                    />
                    <span className="media-cover-badge">
                      <MediaIcon video={isVideo} />
                      <span>{post.items.length.toLocaleString("fa-IR")}</span>
                    </span>
                  </span>
                  <span className="media-cover-title block mt-2 text-slate-900 font-bold text-sm md:text-base line-clamp-3 md:line-clamp-4 leading-relaxed group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </span>
                </button>
              )}
              <SourceLink post={post} />
            </div>
          );
        })}
      </div>
      {!result.data.length && !error ? (
        <p className="media-gallery-empty">
          هنوز {kind === "PHOTOS" ? "آلبوم عکسی" : "ویدیویی"} منتشر نشده است.
        </p>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
      {result.meta.hasMore || error ? (
        <button
          className="media-load-more"
          disabled={loading}
          onClick={() => void loadMore()}
        >
          {loading ? "در حال دریافت…" : error ? "تلاش دوباره" : "نمایش بیشتر"}
        </button>
      ) : null}
      {openIndex !== null
        ? createPortal(
            <ReelsViewer
              posts={result.data}
              start={openIndex}
              onClose={close}
              hasMore={result.meta.hasMore}
              loading={loading}
              error={error}
              onMore={loadMore}
            />,
            document.body,
          )
        : null}
    </section>
  );
}

function ReelsViewer({
  posts,
  start,
  onClose,
  hasMore,
  loading,
  error,
  onMore,
}: {
  posts: MediaPost[];
  start: number;
  onClose: () => void;
  hasMore: boolean;
  loading: boolean;
  error: string;
  onMore: () => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(start);

  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const modal = dialog.current;
    modal?.showModal();
    const element = feed.current;
    if (element) {
      element.scrollTop = start * element.clientHeight;
    }
    const resize = new ResizeObserver(() => {
      if (element) {
        const current = Number(element.dataset.active ?? start);
        element.scrollTop = current * element.clientHeight;
      }
    });
    if (element) resize.observe(element);
    return () => {
      resize.disconnect();
      modal?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [start]);

  const navigate = (next: number) => {
    const index = Math.max(0, Math.min(posts.length - 1, next));
    const element = feed.current;
    if (element) {
      element.scrollTo({
        top: index * element.clientHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  };

  return (
    <dialog
      className="reels-dialog fixed inset-0 w-full h-[100dvh] max-w-none max-h-none m-0 p-0 border-0 bg-black text-white overflow-hidden z-50"
      ref={dialog}
      aria-label="نمایش عکس و ویدیو"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        )
          return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          navigate(active + (event.key === "ArrowDown" ? 1 : -1));
        }
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
    >
      {/* Top Header with Brand and standard Exit ('X') button at top right */}
      <div className="fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-6 pointer-events-none">
        <span className="text-white/80 font-bold text-sm tracking-wide pointer-events-auto select-none">
          سینما نمایش
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-neutral-800 text-white/90 hover:text-white transition-all shadow-xl border border-white/10 flex items-center justify-center cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Snap feed */}
      <div
        className="reels-feed w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory overscroll-contain"
        ref={feed}
        data-active={active}
        onScroll={(event) => {
          const element = event.currentTarget;
          setActive(
            Math.min(
              posts.length - 1,
              Math.max(0, Math.round(element.scrollTop / element.clientHeight)),
            ),
          );
        }}
      >
        {posts.map((post, index) => (
          <ReelSlide
            key={post.id}
            post={post}
            active={active === index}
          />
        ))}
      </div>

      {/* Floating Modern Round Icon Navigation Controls */}
      <div className="fixed bottom-6 inset-x-0 mx-auto w-fit z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
        <button
          type="button"
          aria-label="محتوای بعدی"
          disabled={active === posts.length - 1}
          onClick={() => navigate(active + 1)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span className="text-white text-xs md:text-sm font-medium px-2 select-none">
          {(active + 1).toLocaleString("fa-IR")} از {posts.length.toLocaleString("fa-IR")}
        </span>
        <button
          type="button"
          aria-label="محتوای قبلی"
          disabled={active === 0}
          onClick={() => navigate(active - 1)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {active === posts.length - 1 && hasMore ? (
          <button
            disabled={loading}
            onClick={() => void onMore()}
            className="text-xs bg-orange-600 hover:bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-full transition-colors ml-1 cursor-pointer"
          >
            {loading ? "…" : "بیشتر"}
          </button>
        ) : null}
        {error ? <span role="alert" className="text-red-400 text-xs mr-2">{error}</span> : null}
      </div>
    </dialog>
  );
}

function ReelSlide({
  post,
  active,
}: {
  post: MediaPost;
  active: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const asset = post.items[index]?.media;
  const isVideo = asset?.mimeType?.startsWith("video/") || post.kind === "VIDEOS";

  useEffect(() => {
    const player = video.current;
    if (active && player) {
      void player.play().catch(() => undefined);
    } else {
      player?.pause();
    }
    const visibility = () => {
      if (document.hidden) player?.pause();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      player?.pause();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [active, index]);

  const change = (next: number) => {
    const target = Math.max(0, Math.min(post.items.length - 1, next));
    if (target === index) return;
    setIndex(target);
    setFailed(false);
  };

  return (
    <article
      className="reel-slide w-full h-full min-h-0 flex flex-col justify-center items-center px-4 md:px-8 pt-16 pb-20 snap-start"
      aria-hidden={!active}
      inert={!active ? true : undefined}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center flex-1 min-h-0">
        {/* Video / Media Player Container */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
          {active && isVideo && asset ? (
            <video
              key={asset.id || asset.url}
              ref={video}
              src={asset.url}
              poster={post.cover.url}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
              onError={() => setFailed(true)}
            />
          ) : asset ? (
            <div className="relative w-full h-full">
              <Image
                src={active ? asset.url : post.cover.url}
                alt={asset.alt || post.title}
                fill
                unoptimized
                className="object-contain"
                draggable={false}
              />
            </div>
          ) : null}

          {/* Multiple items gallery navigation if post has multiple items */}
          {post.items.length > 1 ? (
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between pointer-events-none z-10">
              <button
                type="button"
                aria-label="فایل قبلی"
                disabled={index === 0}
                onClick={() => change(index - 1)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all disabled:opacity-30 shadow-lg border border-white/10 cursor-pointer"
              >
                <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="px-3 py-1 rounded-full bg-black/70 text-white text-xs backdrop-blur-sm border border-white/10 select-none">
                {(index + 1).toLocaleString("fa-IR")} از {post.items.length.toLocaleString("fa-IR")}
              </span>
              <button
                type="button"
                aria-label="فایل بعدی"
                disabled={index === post.items.length - 1}
                onClick={() => change(index + 1)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all disabled:opacity-30 shadow-lg border border-white/10 cursor-pointer"
              >
                <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : null}

          {failed ? (
            <p className="absolute top-4 inset-x-4 bg-red-950/80 text-red-200 border border-red-500/40 rounded-lg p-3 text-sm text-center">
              پخش فایل ممکن نشد؛ اتصال یا فرمت ویدیو را بررسی کنید.
            </p>
          ) : null}
        </div>

        {/* Details section underneath */}
        <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-4 md:px-6 py-4 mt-4 max-h-48 text-right">
          <h2 className="text-lg md:text-xl font-bold text-white mb-2">{post.title}</h2>
          {post.description ? (
            <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          ) : null}
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <SourceLink post={post} />
            {asset?.credit ? (
              <small className="text-gray-400 text-xs">{asset.credit}</small>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
