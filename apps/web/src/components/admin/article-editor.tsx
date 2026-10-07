"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  adminFetch,
  type AdminArticle,
  type AdminCategory,
  type MediaAsset,
} from "@/lib/admin-api";
import { MediaUploader } from "./media-uploader";
import { ArticleBlocksEditor, type ContentBlockForm } from "./article-blocks-editor";
import { DisplayOrderEditor } from "./display-order-editor";

type ArticleEditorProps = { articleId?: string };
type SourceForm = { url: string; title: string; publisher: string; author: string; publishedAt: string };

const emptySource: SourceForm = { url: "", title: "", publisher: "", author: "", publishedAt: "" };
const statusOptions = [
  ["DRAFT", "پیش‌نویس"],
  ["IN_REVIEW", "ارسال برای بررسی"],
  ["SCHEDULED", "زمان‌بندی انتشار"],
  ["PUBLISHED", "انتشار در سایت"],
  ["ARCHIVED", "بایگانی"],
] as const;

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [lead, setLead] = useState("");
  const [body, setBody] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlockForm[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<AdminArticle["status"]>("DRAFT");
  const [publishedAt, setPublishedAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [tags, setTags] = useState("");
  const [sources, setSources] = useState<SourceForm[]>([{ ...emptySource }]);
  const [coverImage, setCoverImage] = useState<MediaAsset | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const requests: [Promise<{ data: AdminCategory[] }>, Promise<{ data: AdminArticle }> | null] = [
      adminFetch("/editorial/categories"),
      articleId ? adminFetch(`/editorial/articles/${articleId}`) : null,
    ];
    Promise.all([requests[0], requests[1]])
      .then(([categoryResponse, articleResponse]) => {
        setCategories(categoryResponse.data);
        if (categoryResponse.data[0]) {
          setCategoryId((current) => current || categoryResponse.data[0].id);
        }
        if (!articleResponse) return;
        const article = articleResponse.data;
        setTitle(article.title);
        setSlug(article.slug);
        setSlugTouched(true);
        setLead(article.lead);
        setBody(article.body);
        setContentBlocks((article.contentBlocks ?? []).map((block) => ({ key: block.id, kind: block.kind, text: block.text ?? "", images: block.images.map(({ media }) => media) })));
        setCategoryId(article.category.id);
        setStatus(article.status);
        setPublishedAt(toLocalInput(article.publishedAt));
        setSeoTitle(article.seoTitle || "");
        setSeoDescription(article.seoDescription || "");
        setTags(article.tags.map(({ tag }) => tag.title).join("، "));
        setSources(article.sources.length > 0 ? article.sources.map((source) => ({
          url: source.url,
          title: source.title || "",
          publisher: source.publisher || "",
          author: source.author || "",
          publishedAt: toLocalInput(source.publishedAt),
        })) : [{ ...emptySource }]);
        setCoverImage(article.coverImage);
        setImageAlt(article.coverImage?.alt || "");
        setImageCredit(article.coverImage?.credit || "");
        setImageCaption(article.coverImage?.caption || "");
        const placement = article.homepagePlacements.find((item) => item.slot === "LEAD");
        setFeatured(Boolean(placement));
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "اطلاعات خبر دریافت نشد"))
      .finally(() => setLoading(false));
  }, [articleId]);

  const wordCount = useMemo(() => [body, ...contentBlocks.filter((block) => block.kind === "TEXT").map((block) => block.text)].join(" ").trim().split(/\s+/).filter(Boolean).length, [body, contentBlocks]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      for (const block of contentBlocks) {
        if (block.kind === "TEXT" && !block.text.trim()) throw new Error("متن بخش‌های اضافه را تکمیل کنید یا بخش خالی را حذف کنید.");
        if (block.kind === "IMAGES" && (!block.images.length || block.images.some((image) => !image))) throw new Error("عکس‌های هر گروه را انتخاب کنید یا جایگاه خالی را حذف کنید.");
      }
      const blockImages = [...new Map(contentBlocks.flatMap((block) => block.images.filter((media): media is MediaAsset => Boolean(media))).map((media) => [media.id, media])).values()];
      for (const media of blockImages) {
        await adminFetch(`/editorial/media/${media.id}`, { method: "PATCH", body: JSON.stringify({ alt: media.alt, credit: media.credit ?? "", caption: media.caption ?? "" }) });
      }
      if (coverImage) {
        await adminFetch(`/editorial/media/${coverImage.id}`, {
          method: "PATCH",
          body: JSON.stringify({ alt: imageAlt, credit: imageCredit, caption: imageCaption }),
        });
      }
      const payload = {
        title,
        slug: slug.trim(),
        lead,
        body,
        contentBlocks: contentBlocks.map((block) => block.kind === "TEXT" ? { kind: block.kind, text: block.text } : { kind: block.kind, mediaIds: block.images.map((media) => media!.id) }),
        categoryId,
        coverImageId: coverImage?.id,
        status,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        seoTitle,
        seoDescription,
        tags: tags.split(/[،,]/).map((item) => item.trim()).filter(Boolean),
        sources: sources.filter((source) => source.url.trim()).map((source) => ({
          ...source,
          publishedAt: source.publishedAt ? new Date(source.publishedAt).toISOString() : undefined,
        })),
        featured,
      };
      const response = await adminFetch<{ data: AdminArticle }>(
        articleId ? `/editorial/articles/${articleId}` : "/editorial/articles",
        { method: articleId ? "PATCH" : "POST", body: JSON.stringify(payload) },
      );
      setNotice(status === "PUBLISHED" ? "خبر ذخیره و در سایت منتشر شد." : "تغییرات خبر ذخیره شد.");
      if (!articleId) router.replace(`/admin/articles/${response.data.id}/edit`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ذخیره خبر انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!articleId || !window.confirm(`خبر «${title}» برای همیشه حذف شود؟ نظرات و لایک‌های آن هم حذف می‌شوند و این کار قابل بازگشت نیست. برای توقف موقت نمایش، از بایگانی استفاده کنید.`)) return;
    setSaving(true);
    setError("");
    try {
      await adminFetch(`/editorial/articles/${articleId}`, { method: "DELETE" });
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "حذف خبر انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!articleId || !window.confirm("این خبر بایگانی شود؟")) return;
    setSaving(true);
    try {
      await adminFetch(`/editorial/articles/${articleId}/archive`, { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "بایگانی خبر انجام نشد");
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page admin-empty">در حال آماده‌کردن فرم خبر…</div>;

  return (
    <form className="admin-page admin-editor" onSubmit={save}>
      <div className="admin-page-heading">
        <div><span>{articleId ? "ویرایش محتوا" : "مطلب تازه"}</span><h1>{articleId ? "ویرایش خبر" : "ثبت خبر جدید"}</h1><p>اطلاعات اصلی، تصویر و وضعیت انتشار را تکمیل کنید.</p></div>
        <div className="admin-heading-actions">
          {articleId && status === "PUBLISHED" ? <Link href={`/articles/${slug}`} target="_blank">مشاهده خبر</Link> : null}
          <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره خبر"}</button>
        </div>
      </div>
      {error ? <div className="admin-alert is-error">{error}</div> : null}
      {notice ? <div className="admin-alert is-success">{notice}</div> : null}
      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <section className="admin-card">
            <div className="admin-card-heading"><span>۱</span><div><h2>متن اصلی خبر</h2><p>تیتر، خلاصه و متن اصلی مطلب</p></div></div>
            <label className="admin-field"><span>تیتر خبر</span><input value={title} onChange={(event) => { setTitle(event.target.value); if (!slugTouched) setSlug(slugify(event.target.value)); }} maxLength={220} required /></label>
            <label className="admin-field"><span>شناسه نشانی (Slug)</span><input dir="ltr" value={slug} onChange={(event) => { setSlugTouched(true); setSlug(event.target.value); }} maxLength={220} required /><small>حروف فارسی/انگلیسی، عدد، خط تیره (-) و زیرخط (_) مجازند؛ فاصله و / مجاز نیست. بهتر است بعد از انتشار تغییر نکند.</small></label>
            <label className="admin-field"><span>لید یا خلاصه</span><textarea rows={4} value={lead} onChange={(event) => setLead(event.target.value)} maxLength={600} required /><small>{lead.length.toLocaleString("fa-IR")} از ۶۰۰ نویسه</small></label>
            <label className="admin-field"><span>متن اصلی خبر</span><textarea className="admin-body-editor" rows={12} value={body} onChange={(event) => setBody(event.target.value)} required /><small>{wordCount.toLocaleString("fa-IR")} واژه — برای پاراگراف جدید یک خط خالی بگذارید. کپی و پیست متن پشتیبانی می‌شود.</small></label>
          </section>

          <section className="admin-card">
            <div className="admin-card-heading"><span>۲</span><div><h2>تصویر اصلی</h2><p>آپلود، Drag & Drop، چسباندن یا انتخاب از گالری</p></div></div>
            <MediaUploader value={coverImage} alt={imageAlt} credit={imageCredit} onChange={(media) => { setCoverImage(media); if (!imageAlt) setImageAlt(media.alt); if (!imageCredit) setImageCredit(media.credit || ""); }} />
            <div className="admin-field-grid">
              <label className="admin-field"><span>متن جایگزین تصویر</span><input value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} placeholder="توصیف دقیق چیزی که در تصویر دیده می‌شود" /></label>
              <label className="admin-field"><span>اعتبار تصویر</span><input value={imageCredit} onChange={(event) => setImageCredit(event.target.value)} placeholder="نام عکاس، خبرگزاری یا صاحب اثر" /></label>
            </div>
            <label className="admin-field"><span>زیرنویس تصویر</span><input value={imageCaption} onChange={(event) => setImageCaption(event.target.value)} placeholder="اختیاری" /></label>
          </section>

          <ArticleBlocksEditor blocks={contentBlocks} onChange={setContentBlocks} />

          <section className="admin-card">
            <div className="admin-card-heading"><span>۳</span><div><h2>منبع و برچسب‌ها</h2><p>اطلاعات لازم برای پیگیری و دسته‌بندی محتوا</p></div></div>
            <label className="admin-field"><span>برچسب‌ها</span><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="جشنواره فجر، اکران، بازیگران" /><small>برچسب‌ها را با ویرگول جدا کنید.</small></label>
            {sources.map((source, index) => (
              <div className="admin-source-row" key={index}>
                <label className="admin-field"><span>نشانی منبع</span><input dir="ltr" type="url" value={source.url} onChange={(event) => setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))} placeholder="https://…" /></label>
                <label className="admin-field"><span>عنوان منبع</span><input value={source.title} onChange={(event) => setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} /></label>
                <label className="admin-field"><span>رسانه/ناشر</span><input value={source.publisher} onChange={(event) => setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, publisher: event.target.value } : item))} /></label>
                <label className="admin-field"><span>نام نویسنده منبع</span><input value={source.author} onChange={(event) => setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, author: event.target.value } : item))} /></label>
                <label className="admin-field"><span>زمان انتشار منبع</span><input type="datetime-local" value={source.publishedAt} onChange={(event) => setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, publishedAt: event.target.value } : item))} /></label>
                {sources.length > 1 ? <button type="button" onClick={() => setSources((current) => current.filter((_, itemIndex) => itemIndex !== index))}>حذف منبع</button> : null}
              </div>
            ))}
            <button className="admin-secondary-button" type="button" onClick={() => setSources((current) => [...current, { ...emptySource }])}>＋ افزودن منبع دیگر</button>
          </section>

          <section className="admin-card">
            <div className="admin-card-heading"><span>۴</span><div><h2>تنظیمات موتور جست‌وجو</h2><p>در صورت خالی‌بودن از تیتر و لید استفاده می‌شود</p></div></div>
            <label className="admin-field"><span>عنوان SEO (اختیاری)</span><input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} maxLength={220} placeholder="مثلاً: نخستین تصویر لیلا حاتمی در فیلم بُت" /><small>عنوان کوتاه و دقیق برای موتور جست‌وجو؛ اگر خالی باشد، تیتر خبر استفاده می‌شود.</small></label>
            <label className="admin-field"><span>توضیح SEO (اختیاری)</span><textarea rows={3} value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} maxLength={320} placeholder="خلاصهٔ روشن خبر در یک یا دو جمله" /><small>خلاصه‌ای بدون تکرار کلمات؛ اگر خالی باشد، لید خبر استفاده می‌شود. نمایش عین این متن در گوگل تضمین نیست.</small></label>
          </section>
        </div>

        <aside className="admin-editor-sidebar">
          <section className="admin-card">
            <h2>انتشار</h2>
            <label className="admin-field"><span>دسته‌بندی</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>{categories.map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}</select></label>
            <label className="admin-field"><span>وضعیت</span><select value={status} onChange={(event) => setStatus(event.target.value as AdminArticle["status"])}>{statusOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label className="admin-field"><span>زمان انتشار</span><input type="datetime-local" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} required={status === "SCHEDULED"} /></label>
            <label className="admin-check"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /><span><strong>تازه‌های صفحه اول</strong><small>در اسلایدر بالای صفحه نمایش داده شود</small></span></label>
            <small className="admin-field-note">خبر جدید پس از ذخیره به انتهای فهرست اضافه می‌شود؛ جای آن را از چینش زیر تغییر دهید.</small>
            <DisplayOrderEditor title="چینش خبرهای اسلایدر" path="/editorial/articles/featured-order" hint="فقط چهار خبر منتشرشدهٔ اول در اسلایدر نمایش داده می‌شوند. ابتدا تغییرات خبر فعلی را ذخیره کنید." />
            <button className="admin-primary-button admin-save-wide" type="submit" disabled={saving}>{saving ? "در حال ذخیره…" : status === "PUBLISHED" ? "ذخیره و انتشار" : "ذخیره تغییرات"}</button>
            {articleId ? <button className="admin-danger-button" type="button" onClick={() => void archive()} disabled={saving}>بایگانی خبر</button> : null}
            {articleId ? <button className="admin-danger-button" type="button" onClick={() => void remove()} disabled={saving}>حذف دائمی خبر</button> : null}
          </section>
          <section className="admin-card admin-checklist"><h2>چک‌لیست انتشار</h2><ul><li className={title ? "is-done" : ""}>تیتر خبر</li><li className={lead.length >= 10 ? "is-done" : ""}>لید کامل</li><li className={body.length >= 20 ? "is-done" : ""}>متن خبر</li><li className={coverImage ? "is-done" : ""}>تصویر اصلی</li><li className={imageAlt ? "is-done" : ""}>متن جایگزین تصویر</li><li className={categoryId ? "is-done" : ""}>دسته‌بندی</li></ul></section>
        </aside>
      </div>
    </form>
  );
}
