import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "هنرنامه | روایت هنر امروز",
    template: "%s | هنرنامه",
  },
  description:
    "خبر، گفت‌وگو و تحلیل هنرهای تجسمی، سینما، موسیقی، ادبیات، تئاتر و معماری.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "هنرنامه",
    title: "هنرنامه | روایت هنر امروز",
    description:
      "خبر، گفت‌وگو و تحلیل جریان‌های تازه هنر در یک تجربه فارسی و خوانا.",
    images: [{ url: "/og.png", width: 1792, height: 938, alt: "هنرنامه؛ روایت هنر امروز" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "هنرنامه | روایت هنر امروز",
    description:
      "خبر، گفت‌وگو و تحلیل جریان‌های تازه هنر در یک تجربه فارسی و خوانا.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
