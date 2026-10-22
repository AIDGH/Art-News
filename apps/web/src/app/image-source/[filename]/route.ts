import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadedImageFilename } from "@/lib/uploaded-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Unlike public's build-time inventory, this also finds files uploaded after deploy.
// Next's image optimizer handles resizing, WebP negotiation and disk caching.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const match = uploadedImageFilename.exec(filename);
  if (!match) return new Response(null, { status: 404 });

  try {
    const bytes = await readFile(path.join(process.cwd(), "public", "uploads", filename));
    const extension = match[1].toLowerCase();
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": `image/${extension === "jpg" ? "jpeg" : extension}`,
        "Cache-Control": "public, max-age=604800, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return new Response(null, { status: code === "ENOENT" ? 404 : 500 });
  }
}
