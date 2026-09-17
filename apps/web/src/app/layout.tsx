import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fetchSiteSettings } from "@/lib/api";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "سینما نمایش | رسانه سینما و نمایش",
    template: "%s | سینما نمایش",
  },
  description:
    "خبر، نقد و گفت‌وگو درباره سینما، تئاتر، تلویزیون و شبکه نمایش خانگی.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "سینما نمایش",
    title: "سینما نمایش | رسانه سینما و نمایش",
    description:
      "خبر، نقد و گفت‌وگو از سینمای ایران و جهان در یک تجربه فارسی و سریع.",
    images: [{ url: "/og.png", width: 1735, height: 907, alt: "سینما نمایش" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سینما نمایش | رسانه سینما و نمایش",
    description:
      "خبر، نقد و گفت‌وگو از سینمای ایران و جهان در یک تجربه فارسی و سریع.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteSettings = await fetchSiteSettings();

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="public-site-header">
          <SiteHeader />
        </div>
        {children}
        <div className="public-site-footer">
          <SiteFooter description={siteSettings.footerDescription} />
        </div>
      </body>
    </html>
  );
}
