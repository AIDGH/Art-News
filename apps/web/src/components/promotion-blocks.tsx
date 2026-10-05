import Image from "next/image";
import { fetchAdvertisements } from "@/lib/api";

export function EcranNewsPromo() {
  return (
    <div
      className="ecran-banner"
      aria-label="معرفی رسانه اکران نیوز"
    >
      <div className="ecran-banner-logo">
        <Image alt="Ecran News Logo" className="w-full h-auto object-contain" height={140} src="/ecran-logo.png" width={140}/>
      </div>

      <div className="ecran-banner-text">
        <p>
          رسانه معتبر خبر، نقد فیلم، بازیگری، تلویزیون، سریال، نمایش خانگی و تئاتر
        </p>
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
