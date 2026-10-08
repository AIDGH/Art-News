import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fetchSiteSettings } from "@/lib/api";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "سینما نمایش | رسانه سینما و نمایش",
    template: "%s | سینما نمایش",
  },
  description:
    "سینما نمایش؛ اخبار، نقد و گفت‌وگو درباره فیلم، سریال و تئاتر ایران و جهان.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "سینما نمایش",
    title: "سینما نمایش | رسانه سینما و نمایش",
    description: "از فیلم و سریال و تئاتر می‌گوییم.",
    images: [{ url: "/logo-cinema-namayesh.png", alt: "سینما نمایش" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سینما نمایش | رسانه سینما و نمایش",
    description: "از فیلم و سریال و تئاتر می‌گوییم.",
    images: ["/logo-cinema-namayesh.png"],
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
