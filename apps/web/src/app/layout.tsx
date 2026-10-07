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
    "پایگاه خبری سینما نمایش، رسانه انتشار تازهترین و مهمترین اخبار فرهنگی است",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "سینما نمایش",
    title: "سینما نمایش | رسانه سینما و نمایش",
    description:
      "پایگاه خبری سینما نمایش، رسانه انتشار تازهترین و مهمترین اخبار فرهنگی است",
    images: [{ url: "/logo-cinema-namayesh.png", alt: "سینما نمایش" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سینما نمایش | رسانه سینما و نمایش",
    description:
      "پایگاه خبری سینما نمایش، رسانه انتشار تازهترین و مهمترین اخبار فرهنگی است",
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
