"use client";

import type { MediaAsset } from "@/lib/admin-api";
import { MediaUploader } from "./media-uploader";

export type ContentBlockForm = {
  key: string;
  kind: "TEXT" | "IMAGES";
  text: string;
  images: Array<MediaAsset | null>;
};

export function ArticleBlocksEditor({ blocks, onChange }: {
  blocks: ContentBlockForm[];
  onChange: (blocks: ContentBlockForm[]) => void;
}) {
  const update = (index: number, patch: Partial<ContentBlockForm>) => onChange(blocks.map((block, i) => i === index ? { ...block, ...patch } : block));
  const move = (index: number, direction: number) => {
    const next = [...blocks];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  };
  const add = (kind: ContentBlockForm["kind"]) => onChange([...blocks, { key: crypto.randomUUID(), kind, text: "", images: kind === "IMAGES" ? [null] : [] }]);

  return <section className="admin-card">
    <div className="admin-card-heading"><span>＋</span><div><h2>ادامهٔ مطلب</h2><p>این بخش‌ها پس از تصویر اصلی و متن اصلی خبر، به همین ترتیب نمایش داده می‌شوند.</p></div></div>
    <div className="admin-content-blocks">
      {blocks.map((block, index) => <div className="admin-content-block" key={block.key}>
        <div className="admin-block-heading">
          <strong>{(index + 1).toLocaleString("fa-IR")} · {block.kind === "TEXT" ? "متن" : "گروه عکس"}</strong>
          <div className="admin-block-actions">
            <button type="button" aria-label="انتقال بخش به بالا" disabled={index === 0} onClick={() => move(index, -1)}>↑ بالا</button>
            <button type="button" aria-label="انتقال بخش به پایین" disabled={index === blocks.length - 1} onClick={() => move(index, 1)}>↓ پایین</button>
            <button type="button" onClick={() => onChange(blocks.filter((_, i) => i !== index))}>حذف بخش</button>
          </div>
        </div>
        {block.kind === "TEXT" ? <label className="admin-field"><span>متن این بخش</span><textarea rows={6} maxLength={50000} value={block.text} required onChange={(event) => update(index, { text: event.target.value })} /></label>
          : <><div className="admin-block-images">{block.images.map((media, imageIndex) => <div className="admin-block-image" key={imageIndex}>
            <MediaUploader value={media} alt={media?.alt ?? ""} credit={media?.credit ?? ""} onChange={(value) => update(index, { images: block.images.map((item, i) => i === imageIndex ? value : item) })} />
            {media ? <>
              <label className="admin-field"><span>توضیح تصویر</span><input required value={media.alt} onChange={(event) => update(index, { images: block.images.map((item, i) => i === imageIndex ? { ...media, alt: event.target.value } : item) })} /></label>
              <label className="admin-field"><span>اعتبار تصویر</span><input value={media.credit ?? ""} onChange={(event) => update(index, { images: block.images.map((item, i) => i === imageIndex ? { ...media, credit: event.target.value } : item) })} /></label>
              <label className="admin-field"><span>زیرنویس</span><input value={media.caption ?? ""} onChange={(event) => update(index, { images: block.images.map((item, i) => i === imageIndex ? { ...media, caption: event.target.value } : item) })} /></label>
            </> : null}
            <button className="admin-secondary-button" type="button" onClick={() => update(index, { images: block.images.filter((_, i) => i !== imageIndex) })}>حذف این عکس</button>
          </div>)}</div>
          <button className="admin-secondary-button" type="button" disabled={block.images.length >= 7} onClick={() => update(index, { images: [...block.images, null] })}>＋ افزودن عکس به این گروه</button>
          </>}
      </div>)}
    </div>
    <div className="admin-block-actions">
      <button className="admin-secondary-button" type="button" disabled={blocks.length >= 50} onClick={() => add("TEXT")}>＋ افزودن متن</button>
      <button className="admin-secondary-button" type="button" disabled={blocks.length >= 50} onClick={() => add("IMAGES")}>＋ افزودن گروه عکس</button>
    </div>
  </section>;
}
