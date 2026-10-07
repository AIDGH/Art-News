import Image from "next/image";
import { fetchAdvertisements } from "@/lib/api";

export async function AdvertisementPlaceholder({
  label = "جایگاه تبلیغات",
  placement = "HOME",
}: { label?: string; placement?: "HOME" | "ARTICLE" | "CATEGORY" } = {}) {
  const ads = await fetchAdvertisements(placement);
  const itemClassName = placement === "ARTICLE"
    ? "w-full"
    : "w-full md:w-[calc(50%-0.5rem)]";
  const mediaClassName = "w-full h-full aspect-[3/1] object-cover";
  if (ads.length) return <div className="flex flex-wrap justify-center w-full gap-4 mb-6! mt-6!" aria-label={label}>
    {ads.map((ad) => <section className={itemClassName} key={ad.id}>
      {ad.media.mimeType.startsWith("video/") ? <video className={mediaClassName} controls playsInline preload="none" aria-label={ad.media.alt || ad.title}><source src={ad.media.url} type={ad.media.mimeType} /></video>
        : ad.targetUrl ? <a className="block w-full" href={ad.targetUrl} target="_blank" rel="sponsored noopener noreferrer"><Image className={mediaClassName} src={ad.media.url} alt={ad.media.alt || ad.title} width={1200} height={400} unoptimized /></a>
          : <Image className={mediaClassName} src={ad.media.url} alt={ad.media.alt || ad.title} width={1200} height={400} unoptimized />}
    </section>)}
  </div>;
  return null;
}
