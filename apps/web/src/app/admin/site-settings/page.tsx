"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch, type AdminSiteSettings } from "@/lib/admin-api";

export default function AdminSiteSettingsPage() {
  const [footerDescription, setFooterDescription] = useState("");
  const [aboutBody, setAboutBody] = useState("");
  const [ecranPromoText, setEcranPromoText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminFetch<{ data: AdminSiteSettings }>("/editorial/site-settings")
      .then(({ data }) => {
        setFooterDescription(data.footerDescription);
        setAboutBody(data.aboutBody);
        setEcranPromoText(data.ecranPromoText);
      })
      .catch((caught) => {
        setError(caught instanceof Error ? caught.message : "متن‌های سایت دریافت نشدند");
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = await adminFetch<{ data: AdminSiteSettings }>(
        "/editorial/site-settings",
        {
          method: "PUT",
          body: JSON.stringify({ footerDescription, aboutBody, ecranPromoText }),
        },
      );
      setFooterDescription(data.footerDescription);
      setAboutBody(data.aboutBody);
      setEcranPromoText(data.ecranPromoText);
      setNotice("متن‌های سایت ذخیره شدند و حداکثر تا یک دقیقه در سایت نمایش داده می‌شوند.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ذخیره متن‌ها انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>محتوای ثابت</span>
          <h1>متن‌های سایت</h1>
          <p>متن فوتر، درباره ما و تبلیغ اکران نیوز را بدون تغییر کد مدیریت کنید.</p>
        </div>
      </div>
      {error ? <div className="admin-alert is-error">{error}</div> : null}
      {notice ? <div className="admin-alert is-success">{notice}</div> : null}
      {loading ? (
        <div className="admin-empty">در حال دریافت متن‌ها…</div>
      ) : (
        <form className="admin-card admin-site-settings-form" onSubmit={submit}>
          <label className="admin-field">
            <span>متن تبلیغ اکران نیوز</span>
            <textarea rows={4} maxLength={1200} required value={ecranPromoText} onChange={(event) => setEcranPromoText(event.target.value)} />
            <small>در تمام جایگاه‌های اکران نیوز نمایش داده می‌شود؛ حداکثر ۱۲۰۰ نویسه.</small>
          </label>
          <label className="admin-field">
            <span>متن زیر «سینما نمایش» در فوتر</span>
            <textarea
              rows={3}
              maxLength={300}
              value={footerDescription}
              onChange={(event) => setFooterDescription(event.target.value)}
              required
            />
            <small>حداکثر ۳۰۰ نویسه</small>
          </label>
          <label className="admin-field">
            <span>متن صفحه درباره ما</span>
            <textarea
              className="admin-body-editor"
              rows={12}
              maxLength={6000}
              value={aboutBody}
              onChange={(event) => setAboutBody(event.target.value)}
              placeholder="متن معرفی رسانه را اینجا بنویسید…"
            />
            <small>برای ساخت پاراگراف جدید، یک خط خالی بگذارید. خالی‌بودن این بخش مجاز است.</small>
          </label>
          <div className="admin-form-actions">
            <button className="admin-primary-button" type="submit" disabled={saving}>
              {saving ? "در حال ذخیره…" : "ذخیره متن‌ها"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
