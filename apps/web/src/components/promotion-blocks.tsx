import Image from "next/image";
import { fetchAdvertisements } from "@/lib/api";

export function EcranNewsPromo() {
  return (
    <div
      className="w-full h-[120px] md:h-[140px] flex flex-row items-stretch bg-[#111]"
      aria-label="معرفی رسانه اکران نیوز"
    >
      {/* Logo Container - Width exactly matches parent's height to create a perfect square */}
      <div className="w-[120px] md:w-[140px] shrink-0 bg-white flex items-center justify-center p-2 md:p-3">
        <Image alt="Ecran News Logo" className="w-full h-auto object-contain" height={140} src="/ecran-logo.png" width={140}/>
      </div>

      {/* Text Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-4 text-center">
        <p className="text-white text-center text-xs md:text-sm leading-relaxed font-medium w-full max-w-[280px] md:max-w-none mx-auto md:whitespace-nowrap">
          🔶 رسانه معتبر خبر، نقد فیلم، بازیگری، تلویزیون، سریال، نمایش خانگی و تئاتر
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
  return (
    <div
      className="w-full h-[120px] md:h-[140px] flex flex-col items-center justify-center border-[1.5px] border-dashed border-gray-400 bg-transparent rounded-none px-4 text-center mt-6"
      aria-label={label}
    >
      <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">تبلیغات</h3>
      <p className="text-xs md:text-sm text-gray-500">
        ابعاد و محتوای نهایی پس از دریافت سفارش تبلیغ مشخص میشود.
      </p>
    </div>
  );
}
