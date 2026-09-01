import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  href?: string;
  eyebrow?: string;
};

export function SectionHeading({ title, href, eyebrow }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {href ? <Link href={href}>مشاهده همه ←</Link> : null}
    </div>
  );
}
