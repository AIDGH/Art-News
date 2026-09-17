"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminFetch, type AdminUser } from "@/lib/admin-api";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(pathname !== "/admin/login");
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      return;
    }
    adminFetch<{ data: AdminUser }>("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`))
      .finally(() => setLoading(false));
  }, [isLogin, pathname, router]);

  const logout = async () => {
    await adminFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  };

  if (isLogin) return <div className="admin-root">{children}</div>;
  if (loading || !user) {
    return <div className="admin-root admin-loading" role="status">در حال ورود به سینما نمایش…</div>;
  }

  return (
    <div className="admin-root">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <Link className="admin-brand" href="/admin">
            <Image src="/logo-cinema-namayesh.png" alt="سینما نمایش" width={92} height={54} priority />
            <span>پنل سینما نمایش</span>
          </Link>
          <nav aria-label="ناوبری پنل">
            <Link className={pathname === "/admin" ? "is-active" : ""} href="/admin">خبرها</Link>
            <Link className={pathname === "/admin/articles/new" ? "is-active" : ""} href="/admin/articles/new">خبر جدید</Link>
            <Link className={pathname === "/admin/categories" ? "is-active" : ""} href="/admin/categories">دسته‌بندی‌ها</Link>
            <Link className={pathname === "/admin/site-settings" ? "is-active" : ""} href="/admin/site-settings">متن‌های سایت</Link>
            <Link href="/" target="_blank">مشاهده سایت</Link>
          </nav>
          <div className="admin-account"><span>{user.displayName}</span><button type="button" onClick={logout}>خروج</button></div>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
