"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area } from "react-easy-crop";

type ImageCropModalProps = {
  file: File;
  aspect: number;
  onCancel: () => void;
  onConfirm: (file: File) => void;
};

const MAX_OUTPUT_WIDTH = 2400;

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("تصویر خوانده نشد."));
    image.src = url;
  });
}

async function cropToFile(url: string, area: Area, source: File): Promise<File> {
  const image = await loadImage(url);
  const scale = Math.min(1, MAX_OUTPUT_WIDTH / area.width);
  const width = Math.max(1, Math.round(area.width * scale));
  const height = Math.max(1, Math.round(area.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("مرورگر از برش تصویر پشتیبانی نمی‌کند.");
  context.imageSmoothingQuality = "high";
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height);
  const type = source.type === "image/png" || source.type === "image/webp" ? source.type : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.92));
  if (!blob) throw new Error("برش تصویر انجام نشد.");
  const extension = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  const baseName = source.name.replace(/\.[^.]+$/, "") || "ad";
  return new File([blob], `${baseName}-cropped.${extension}`, { type });
}

export function ImageCropModal({ file, aspect, onCancel, onConfirm }: ImageCropModalProps) {
  const [url, setUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !processing) onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, processing]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  const confirm = async () => {
    if (!area || !url) return;
    setProcessing(true);
    setError("");
    try {
      onConfirm(await cropToFile(url, area, file));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "برش تصویر انجام نشد.");
      setProcessing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="برش تصویر تبلیغ" dir="rtl">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-900">برش تصویر تبلیغ</h2>
          <p className="mt-1 text-sm text-slate-500">کادر با نسبت ۳ به ۱ قفل است؛ تصویر را جابه‌جا یا بزرگ‌نمایی کنید تا بخش دلخواه در کادر قرار گیرد.</p>
        </div>
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900" style={{ height: "min(55vh, 420px)" }} dir="ltr">
          {url ? (
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
              showGrid
            />
          ) : null}
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <span>بزرگ‌نمایی</span>
          <input type="range" min={1} max={4} step={0.01} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="h-1.5 flex-1 cursor-pointer accent-slate-900" aria-label="بزرگ‌نمایی تصویر" />
        </label>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={processing} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">انصراف</button>
          <button type="button" onClick={() => void confirm()} disabled={processing || !area} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">{processing ? "در حال برش…" : "تایید و برش"}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
