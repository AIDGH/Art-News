"use client";

import { useState } from "react";

export function AdminVideoPreview({ src, label = "پیش‌نمایش ویدیو" }: { src: string; label?: string }) {
  const [error, setError] = useState("");
  return <div className="admin-video-preview">
    <video
      src={src}
      controls
      playsInline
      preload="metadata"
      aria-label={label}
      onLoadedMetadata={(event) => {
        setError("");
        const video = event.currentTarget;
        // Decode a first frame without autoplay, including mobile browsers
        // that otherwise keep a metadata-only video black until playback.
        if (video.currentTime === 0 && Number.isFinite(video.duration) && video.duration > 0.02) {
          video.currentTime = 0.01;
        }
      }}
      onError={(event) => {
        const code = event.currentTarget.error?.code;
        setError(code === 3 || code === 4
          ? "پیش‌نمایش پخش نشد؛ دسترسی به فایل و کدک ویدیو را بررسی کنید. برای سازگاری مرورگر، MP4 با تصویر H.264 و صدای AAC خروجی بگیرید؛ پسوند MP4 به‌تنهایی نوع کدک را مشخص نمی‌کند."
          : "پیش‌نمایش ویدیو دریافت نشد؛ اتصال اینترنت و دسترسی به فایل را بررسی کنید.");
      }}
    />
    {!error ? <p className="admin-field-note">برای پیش‌نمایش، دکمهٔ پخش ویدیو را بزنید.</p> : null}
    {error ? <p className="admin-alert is-error" role="alert">{error}</p> : null}
  </div>;
}
