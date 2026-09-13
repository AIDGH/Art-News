"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminFetch, type AdminCategory } from "@/lib/admin-api";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    adminFetch<{ data: AdminCategory[] }>("/editorial/categories")
      .then(({ data }) => setCategories(data))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "دسته‌بندی‌ها دریافت نشدند"));
  }, []);

  useEffect(() => { load(); }, [load]);

  const reset = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setSortOrder(0);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await adminFetch(editingId ? `/editorial/categories/${editingId}` : "/editorial/categories", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify({ title, slug, description, sortOrder }),
      });
      setNotice(editingId ? "دسته‌بندی ویرایش شد." : "دسته‌بندی جدید ساخته شد.");
      reset();
      load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ذخیره دسته‌بندی انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  const edit = (category: AdminCategory) => {
    setEditingId(category.id);
    setTitle(category.title);
    setSlug(category.slug);
    setDescription(category.description || "");
    setSortOrder(category.sortOrder);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><span>ساختار سایت</span><h1>دسته‌بندی‌ها</h1><p>بخش‌های خبری و ترتیب نمایش آن‌ها را مدیریت کنید.</p></div></div>
      {error ? <div className="admin-alert is-error">{error}</div> : null}
      {notice ? <div className="admin-alert is-success">{notice}</div> : null}
      <div className="admin-category-grid">
        <form className="admin-card admin-category-form" onSubmit={submit}>
          <h2>{editingId ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}</h2>
          <label className="admin-field"><span>عنوان فارسی</span><input value={title} onChange={(event) => { setTitle(event.target.value); if (!editingId && !slug) setSlug(slugify(event.target.value)); }} required /></label>
          <label className="admin-field"><span>شناسه انگلیسی</span><input dir="ltr" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="world-cinema" required /><small>برای نشانی صفحه و اتصال منو استفاده می‌شود.</small></label>
          <label className="admin-field"><span>توضیح کوتاه</span><textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <label className="admin-field"><span>ترتیب نمایش</span><input type="number" min={0} value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} /></label>
          <div className="admin-form-actions"><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره"}</button>{editingId ? <button className="admin-secondary-button" type="button" onClick={reset}>انصراف</button> : null}</div>
        </form>
        <section className="admin-table-card">
          <div className="admin-table-scroll"><table><thead><tr><th>عنوان</th><th>شناسه</th><th>خبرها</th><th>ترتیب</th><th /></tr></thead><tbody>
            {categories.map((category) => <tr key={category.id}><td><strong>{category.title}</strong><small>{category.description}</small></td><td dir="ltr">{category.slug}</td><td>{(category._count?.articles ?? 0).toLocaleString("fa-IR")}</td><td>{category.sortOrder.toLocaleString("fa-IR")}</td><td><button type="button" onClick={() => edit(category)}>ویرایش</button></td></tr>)}
          </tbody></table></div>
        </section>
      </div>
    </div>
  );
}
