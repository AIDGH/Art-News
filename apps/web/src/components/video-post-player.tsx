"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaPost } from "@/lib/media-posts";
import "./video-post-player.css";

export function VideoPostPlayer({ post }: { post: MediaPost }) {
  const items = [...post.items].sort((a, b) => a.position - b.position);
  const [index, setIndex] = useState(() => Math.max(0, items.findIndex((item) => item.media.mimeType.startsWith("video/"))));
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const asset = items[index]?.media;
  const isVideo = asset?.mimeType.startsWith("video/");

  useEffect(() => {
    const current = player.current;
    const pauseWhenHidden = () => { if (document.hidden) current?.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      current?.pause();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [index]);

  if (!asset) return null;

  const select = (next: number) => {
    if (next === index) return;
    player.current?.pause();
    setIndex(next);
    setStarted(false);
    setFailed(false);
  };

  return <section className="video-post container-wide" aria-label={`پخش ${post.title}`}>
    <div className="video-post-stage">
      {isVideo ? <video
        key={asset.id}
        ref={player}
        src={asset.url}
        poster={post.cover.url}
        controls
        playsInline
        preload="metadata"
        aria-label={post.title}
        onPlay={() => { setStarted(true); setFailed(false); }}
        onError={() => setFailed(true)}
      /> : <Image src={asset.url} alt={asset.alt || post.title} fill unoptimized sizes="(max-width: 1100px) 100vw, 900px" />}
      {isVideo && !started && !failed ? <button
        className="video-post-play"
        type="button"
        aria-label="پخش ویدیو"
        onClick={() => { void player.current?.play().catch(() => setFailed(true)); }}
      ><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7Z" /></svg></button> : null}
      {failed ? <div className="video-post-error" role="alert">
        <p>پخش ویدیو ممکن نشد.</p>
        <button type="button" onClick={() => { setFailed(false); setStarted(false); player.current?.load(); }}>تلاش دوباره</button>
        <a href={asset.url} target="_blank" rel="noopener noreferrer">باز کردن فایل</a>
      </div> : null}
    </div>
    {items.length > 1 ? <div className="video-post-files" aria-label="فایل‌های این مطلب">
      {items.map((item, itemIndex) => <button
        type="button"
        key={item.id}
        aria-pressed={index === itemIndex}
        aria-label={`${item.media.mimeType.startsWith("video/") ? "ویدیو" : "عکس"} ${(itemIndex + 1).toLocaleString("fa-IR")}`}
        onClick={() => select(itemIndex)}
      >
        <span className="video-post-thumb"><Image src={item.media.mimeType.startsWith("video/") ? post.cover.url : item.media.url} alt="" fill unoptimized sizes="88px" /></span>
        <span>{item.media.mimeType.startsWith("video/") ? "ویدیو" : "عکس"} {(itemIndex + 1).toLocaleString("fa-IR")}</span>
      </button>)}
    </div> : null}
  </section>;
}
