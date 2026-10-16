import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fetchSiteSettings } from "@/lib/api";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "پایگاه خبری سینما نمایش",
    template: "%s | سینما نمایش",
  },
  description:
    "تازه‌ترین اخبار، نقد و گفت‌وگو درباره سینما، تئاتر، تلویزیون و نمایش خانگی در رسانه سینما نمایش.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "سینما نمایش",
    title: "پایگاه خبری سینما نمایش",
    description: "از فیلم و سریال و تئاتر می‌گوییم.",
    images: [{ url: "/logo-cinema-namayesh.png", alt: "سینما نمایش" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "پایگاه خبری سینما نمایش",
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
        <div className="public-site-header" data-nosnippet>
          <SiteHeader />
        </div>
        {children}
        <div className="public-site-footer" data-nosnippet>
          <SiteFooter description={siteSettings.footerDescription} />
        </div>
      </body>
    </html>
  );
}
