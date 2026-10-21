import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English",
  description: "The English edition of Cinema Namayesh.",
  alternates: { canonical: "/english" },
};

export default function EnglishPage() {
  return (
    <main className="simple-page simple-page-english container-narrow" dir="ltr">
      <span>English edition</span>
      <h1>Cinema Theatre</h1>
    </main>
  );
}
