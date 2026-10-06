import Image from "next/image";
import { fetchAdvertisements } from "@/lib/api";

const BANNER_TEXT =
  "🔸رسانه معتبر خبر، نقد فیلم، بازیگری،  تلویزیون، سریال، نمایش خانگی و تئاتر";

const bannerStyles = {
  // Fills (and never exceeds) the parent container, same width as the slider.
  default: {
    root: "min-h-[104px] min-[761px]:min-h-[140px]",
    logo: "basis-[104px] w-[104px] h-[104px] p-2 min-[761px]:basis-[140px] min-[761px]:w-[140px] min-[761px]:h-[140px] min-[761px]:p-3",
    text: "p-3 text-[.8rem] min-[761px]:p-4 min-[761px]:text-[.9rem]",
  },
  // Left sidebar of the article page: keeps its original proportions.
  sidebar: {
    root: "ps-3 min-h-[120px] min-[761px]:min-h-[140px] min-[1101px]:min-h-[120px]",
    logo: "basis-[120px] w-[120px] h-[120px] p-[10px] min-[761px]:basis-[140px] min-[761px]:w-[140px] min-[761px]:h-[140px] min-[761px]:p-3 min-[1101px]:basis-[104px] min-[1101px]:w-[104px] min-[1101px]:h-[104px]",
    text: "p-4 text-[.85rem] min-[761px]:text-[.9rem] min-[1101px]:p-3 min-[1101px]:text-[.8rem]",
  },
} as const;

export function EcranNewsPromo({
  variant = "default",
}: { variant?: "default" | "sidebar" } = {}) {
  const styles = bannerStyles[variant];

  return (
    <div
      className={`flex w-full max-w-full min-w-0 items-center overflow-hidden bg-[#111] ${styles.root}`}
      aria-label="معرفی رسانه اکران نیوز"
    >
      <div className={`flex shrink-0 items-center bg-white ${styles.logo}`}>
        <Image alt="Ecran News Logo" className="h-auto w-full object-contain" height={140} src="/ecran-logo.png" width={140} />
      </div>

      <div
        className={`min-w-0 flex-1 text-center leading-[1.9] text-white [overflow-wrap:anywhere] ${styles.text}`}
      >
        <p className="whitespace-normal">{BANNER_TEXT}</p>
      </div>
    </div>
  );
}

export async function AdvertisementPlaceholder({
  label = "جایگاه تبلیغات",
  placement = "HOME",
}: { label?: string; placement?: "HOME" | "ARTICLE" | "CATEGORY" } = {}) {
  const ads = await fetchAdvertisements(placement);
  if (ads.length) return <div className="advertisement-list" aria-label={label}>
    {ads.map((ad) => <section className="advertisement-card" key={ad.id}>
      <span className="advertisement-label">تبلیغات</span>
      {ad.media.mimeType.startsWith("video/") ? <video controls playsInline preload="none" aria-label={ad.media.alt || ad.title}><source src={ad.media.url} type={ad.media.mimeType} /></video>
        : ad.targetUrl ? <a href={ad.targetUrl} target="_blank" rel="sponsored noopener noreferrer"><Image src={ad.media.url} alt={ad.media.alt || ad.title} width={1200} height={600} unoptimized /></a>
          : <Image src={ad.media.url} alt={ad.media.alt || ad.title} width={1200} height={600} unoptimized />}
      {ad.text ? <p>{ad.text}</p> : null}
      {ad.targetUrl ? <a className="advertisement-link" href={ad.targetUrl} target="_blank" rel="sponsored noopener noreferrer">مشاهدهٔ {ad.title}</a> : null}
    </section>)}
  </div>;
  return null;
}
