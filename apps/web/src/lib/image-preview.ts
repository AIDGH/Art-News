import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { unstable_cache } from "next/cache";
import { imageSourcePath } from "./uploaded-image";

// Inline previews travel with HTML, so a first-time visitor sees the photo
// before its full responsive version finishes downloading. Uploads are immutable.
const previewForUpload = unstable_cache(async (filename: string) => {
  const directory = process.env.NEWS_UPLOAD_DIRECTORY;
  if (!directory || !path.isAbsolute(directory)) return undefined;
  try {
    const bytes = await readFile(path.join(directory, filename));
    const preview = await sharp(bytes, { limitInputPixels: 40000000 })
      .rotate()
      .resize(40, 24, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 35 })
      .toBuffer();
    return `data:image/webp;base64,${preview.toString("base64")}`;
  } catch {
    // A missing or unsupported photo must never block the homepage.
    return undefined;
  }
}, ["carousel-photo-preview-v1"], { revalidate: 604800 });

export async function getCarouselPreviews(sources: string[]) {
  const previews = await Promise.all([...new Set(sources)].slice(0, 4).map(async (src) => {
    const source = imageSourcePath(src);
    return [src, source ? await previewForUpload(source.slice("/image-source/".length)) : undefined] as const;
  }));
  return Object.fromEntries(previews);
}
