import type { CSSProperties } from "react";

const networks = [
  { id: "instagram", label: "اینستاگرام", href: "https://www.instagram.com/cinemanamayesh.ir/" },
  { id: "telegram", label: "تلگرام" },
  { id: "x", label: "ایکس" },
  { id: "youtube", label: "یوتیوب" },
  { id: "aparat", label: "آپارات" },
  { id: "bale", label: "بله" },
];

export function FooterSocials() {
  return (
    <ul className="footer-socials" aria-label="شبکه‌های اجتماعی سینما نمایش">
      {networks.map(({ id, label, href }) => {
        const icon = <span className="footer-social-icon" aria-hidden="true" style={{ "--social-icon": `url(/icons/social/${id}.svg)` } as CSSProperties} />;
        return (
          <li key={id} className={`footer-social-${id}`}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>{icon}</a>
            ) : (
              <span className="footer-social-pending" role="img" aria-label={`${label} — به‌زودی`} title={`${label} — به‌زودی`}>{icon}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
