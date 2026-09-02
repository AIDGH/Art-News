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
      <h1>Cinema Namayesh</h1>
      <p>
        The English section is being prepared. Selected cinema stories and
        interviews will be published here.
      </p>
    </main>
  );
}
