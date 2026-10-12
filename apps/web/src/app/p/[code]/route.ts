import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, follow" };
  if (!/^[am][A-Za-z0-9_-]{22}$/.test(code)) return new NextResponse("لینک پیدا نشد.", { status: 404, headers });
  try {
    const response = await fetch(`${API_BASE_URL}/articles/short/${code}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) return new NextResponse(response.status === 404 ? "محتوا پیدا نشد." : "سرویس موقتاً در دسترس نیست.", { status: response.status === 404 ? 404 : 503, headers });
    const { data } = await response.json() as { data: { path: string } };
    if (!/^\/articles\/[^/]+$/.test(data.path) && data.path !== "/category/photos") throw new Error("Invalid sharing destination");
    return NextResponse.redirect(siteUrl(data.path), { status: 307, headers });
  } catch {
    return new NextResponse("سرویس موقتاً در دسترس نیست.", { status: 503, headers });
  }
}
