"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { adminFetch, adminUpload, type MediaAsset } from "@/lib/admin-api";
import { mediaFileType } from "@/lib/media-file";
import { ImageCropModal } from "./image-crop-modal";
import { AdminVideoPreview } from "./video-preview";

type MediaUploaderProps = {
  value: MediaAsset | null;
  alt: string;
  credit: string;
  onChange: (media: MediaAsset) => void;
  allowVideo?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
  /** When set (e.g. 3 for 3:1), static images are cropped to this width/height ratio before upload. */
  cropAspect?: number;
};

export function MediaUploader({ value, alt, credit, onChange, allowVideo = false, onUploadingChange, cropAspect }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [library, setLibrary] = useState<MediaAsset[]>([]);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const clearPreview = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreview(null);
  };

  useEffect(() => {
    if (!libraryOpen || library.length > 0) return;
    adminFetch<{ data: MediaAsset[] }>(`/editorial/media${allowVideo ? "?includeVideo=true" : ""}`)
      .then(({ data }) => setLibrary(data))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "گالری باز نشد"));
  }, [library.length, libraryOpen, allowVideo]);

  const validate = (file: File) => {
    const type = mediaFileType(file);
    const video = type?.startsWith("video/");
    if (!type || (video && !allowVideo)) {
      setError(allowVideo ? "این فرمت پشتیبانی نمی‌شود؛ تصویر، گیف یا ویدیوی MP4/WebM انتخاب کنید. فایل MOV را ابتدا به MP4 تبدیل کنید." : "فقط فایل تصویری انتخاب کنید؛ ویدیو را در بخش عکس و ویدیو و نوع «فیلم» بارگذاری کنید.");
      return false;
    }
    if (file.size > (video ? 30 : 8) * 1024 * 1024) {
      setError(video ? "حجم ویدیو باید حداکثر ۳۰ مگابایت باشد." : "حجم تصویر باید حداکثر ۸ مگابایت باشد.");
      return false;
    }
    return true;
  };

  const upload = async (file: File) => {
    if (uploadingRef.current) return;
    if (!validate(file)) return;
    uploadingRef.current = true;
    setUploading(true);
    setProgress(0);
    onUploadingChange?.(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("alt", alt);
    body.append("credit", credit);
    try {
      const { data } = await adminUpload<{ data: MediaAsset }>("/editorial/media", body, setProgress);
      onChange(data);
      setLibrary((current) => [data, ...current]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "بارگذاری فایل انجام نشد");
    } finally {
      clearPreview();
      uploadingRef.current = false;
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  // Entry point for every selected/dropped/pasted file. Static images are routed through
  // the cropper when cropAspect is set; GIFs and videos upload directly.
  const handleFile = (file: File) => {
    if (uploadingRef.current) return;
    setError("");
    if (!validate(file)) return;
    const type = mediaFileType(file)!;
    const normalized = file.type === type ? file : new File([file], file.name, { type, lastModified: file.lastModified });
    clearPreview();
    if (type.startsWith("video/")) {
      const url = URL.createObjectURL(normalized);
      previewRef.current = url;
      setPreview(url);
    }
    if (cropAspect && ["image/jpeg", "image/png", "image/webp"].includes(type)) {
      setCropFile(normalized);
      return;
    }
    void upload(normalized);
  };

  const fileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    event.target.value = "";
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const pasteFromClipboard = async () => {
    setError("");
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith("image/"));
        if (!imageType) continue;
        const blob = await item.getType(imageType);
        handleFile(new File([blob], `clipboard-${Date.now()}.${imageType.split("/")[1] ?? "png"}`, { type: imageType }));
        return;
      }
      setError("در کلیپ‌بورد تصویر پیدا نشد.");
    } catch {
      setError("مرورگر اجازه خواندن تصویر از کلیپ‌بورد را نداد.");
    }
  };

  return (
    <div className="admin-media-control">
      <input ref={inputRef} type="file" accept={`image/jpeg,image/png,image/webp,image/gif${allowVideo ? ",video/mp4,video/webm,video/x-m4v,.mp4,.m4v,.webm" : ""}`} onChange={fileChanged} hidden />
      <div
        className={`admin-dropzone${isDragging ? " is-dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={drop}
        onPaste={(event) => {
          const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
          if (file) handleFile(file);
        }}
        tabIndex={0}
      >
        {value || preview ? (
          <div className="admin-cover-preview">
            {preview || value?.mimeType.startsWith("video/") ? <AdminVideoPreview key={preview ?? value!.url} src={preview ?? value!.url} /> : <Image src={value!.url} alt={alt || value!.alt || "تصویر خبر"} fill unoptimized sizes="(max-width: 800px) 100vw, 640px" />}
            {!preview ? <span>برای جایگزینی، فایل تازه را اینجا رها کنید</span> : null}
          </div>
        ) : (
          <div className="admin-dropzone-empty"><strong>{allowVideo ? "تصویر، گیف یا ویدیو را اینجا رها کنید" : "تصویر را اینجا رها کنید"}</strong><span>یا از دستگاه، گالری و کلیپ‌بورد انتخاب کنید</span></div>
        )}
      </div>
      <div className="admin-media-actions">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>انتخاب از دستگاه</button>
        <button type="button" onClick={() => void pasteFromClipboard()} disabled={uploading}>چسباندن از کلیپ‌بورد</button>
        <button type="button" onClick={() => setLibraryOpen((current) => !current)} disabled={uploading}>{allowVideo ? "گالری فایل‌ها" : "گالری تصاویر"}</button>
      </div>
      {uploading ? <div role="status"><progress max={100} value={progress} aria-label="پیشرفت بارگذاری فایل" style={{ width: "100%" }} /><p className="admin-field-note">{progress === 100 ? "فایل ارسال شد؛ در حال ثبت…" : `در حال بارگذاری فایل… ${progress.toLocaleString("fa-IR")}٪`}</p></div> : null}
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
      {cropFile && cropAspect ? (
        <ImageCropModal
          file={cropFile}
          aspect={cropAspect}
          onCancel={() => setCropFile(null)}
          onConfirm={(cropped) => { setCropFile(null); void upload(cropped); }}
        />
      ) : null}
    </div>
  );
}
