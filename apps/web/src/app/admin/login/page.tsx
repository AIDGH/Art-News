"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next?.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ورود انجام نشد");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <Image src="/logo-cinema-namayesh.png" alt="سینما نمایش" width={130} height={76} priority />
        <span>سینما نمایش</span>
        <h1>ورود به پنل مدیریت</h1>
        <p>برای ثبت، ویرایش و انتشار خبر وارد حساب سینما نمایش شوید.</p>
        <label>ایمیل<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>رمز عبور<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
        {error ? <div className="admin-alert is-error">{error}</div> : null}
        <button className="admin-primary-button" type="submit" disabled={submitting}>{submitting ? "در حال ورود…" : "ورود"}</button>
        <Link className="admin-back-link" href="/">بازگشت به سایت</Link>
      </form>
    </main>
  );
}
