"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { adminFetch, type MediaAsset } from "@/lib/admin-api";

type MediaUploaderProps = {
  value: MediaAsset | null;
  alt: string;
  credit: string;
  onChange: (media: MediaAsset) => void;
  allowVideo?: boolean;
};

export function MediaUploader({ value, alt, credit, onChange, allowVideo = false }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<MediaAsset[]>([]);

  useEffect(() => {
    if (!libraryOpen || library.length > 0) return;
    adminFetch<{ data: MediaAsset[] }>(`/editorial/media${allowVideo ? "?includeVideo=true" : ""}`)
      .then(({ data }) => setLibrary(data))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "گالری باز نشد"));
  }, [library.length, libraryOpen, allowVideo]);

  const upload = async (file: File) => {
    const video = ["video/mp4", "video/webm"].includes(file.type);
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) && !(allowVideo && video)) {
      setError(allowVideo ? "تصویر، گیف یا ویدیوی MP4/WebM انتخاب کنید." : "فقط فایل تصویری انتخاب کنید.");
      return;
    }
    if (file.size > (video ? 30 : 8) * 1024 * 1024) {
      setError(video ? "حجم ویدیو باید حداکثر ۳۰ مگابایت باشد." : "حجم تصویر باید حداکثر ۸ مگابایت باشد.");
      return;
    }
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("alt", alt);
    body.append("credit", credit);
    try {
      const { data } = await adminFetch<{ data: MediaAsset }>("/editorial/media", { method: "POST", body });
      onChange(data);
      setLibrary((current) => [data, ...current]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "آپلود تصویر انجام نشد");
    } finally {
      setUploading(false);
    }
  };

  const fileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void upload(file);
    event.target.value = "";
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void upload(file);
  };

  const pasteFromClipboard = async () => {
    setError("");
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith("image/"));
        if (!imageType) continue;
        const blob = await item.getType(imageType);
        await upload(new File([blob], `clipboard-${Date.now()}`, { type: imageType }));
        return;
      }
      setError("در کلیپ‌بورد تصویر پیدا نشد.");
    } catch {
      setError("مرورگر اجازه خواندن تصویر از کلیپ‌بورد را نداد.");
    }
  };

  return (
    <div className="admin-media-control">
      <input ref={inputRef} type="file" accept={`image/jpeg,image/png,image/webp,image/gif${allowVideo ? ",video/mp4,video/webm" : ""}`} onChange={fileChanged} hidden />
      <div
        className={`admin-dropzone${isDragging ? " is-dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={drop}
        onPaste={(event) => {
          const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
          if (file) void upload(file);
        }}
        tabIndex={0}
      >
        {value ? (
          <div className="admin-cover-preview">
            {value.mimeType.startsWith("video/") ? <video src={value.url} controls playsInline preload="metadata" /> : <Image src={value.url} alt={alt || value.alt || "تصویر خبر"} fill unoptimized sizes="(max-width: 800px) 100vw, 640px" />}
            <span>برای جایگزینی، فایل تازه را اینجا رها کنید</span>
          </div>
        ) : (
          <div className="admin-dropzone-empty"><strong>{allowVideo ? "تصویر، گیف یا ویدیوی تبلیغ را اینجا رها کنید" : "تصویر خبر را اینجا رها کنید"}</strong><span>یا از دستگاه، گالری و کلیپ‌بورد انتخاب کنید</span></div>
        )}
      </div>
      <div className="admin-media-actions">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>انتخاب از دستگاه</button>
        <button type="button" onClick={() => void pasteFromClipboard()} disabled={uploading}>چسباندن از کلیپ‌بورد</button>
        <button type="button" onClick={() => setLibraryOpen((current) => !current)} disabled={uploading}>{allowVideo ? "گالری فایل‌ها" : "گالری تصاویر"}</button>
      </div>
      {uploading ? <p className="admin-field-note">در حال بارگذاری تصویر…</p> : null}
      {error ? <div className="admin-alert is-error">{error}</div> : null}
      {libraryOpen ? (
        <div className="admin-media-library">
          {library.length === 0 ? <p>هنوز تصویری در گالری نیست.</p> : library.map((media) => (
            <button type="button" className={value?.id === media.id ? "is-selected" : ""} onClick={() => { onChange(media); setLibraryOpen(false); }} key={media.id}>
              {media.mimeType.startsWith("video/") ? <span className="admin-video-label">ویدیو</span> : <Image src={media.url} alt={media.alt || "تصویر گالری"} fill unoptimized sizes="120px" />}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
