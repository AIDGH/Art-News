import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/api";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type SitemapArticle = { slug: string; updatedAt: string; publishedAt: string };
type SitemapCategory = { slug: string };

async function fetchEntries<T>(path: string): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Sitemap API unavailable: ${path} (${response.status})`);
  const result = await response.json() as { data: T[] };
  if (!Array.isArray(result.data)) throw new Error(`Invalid sitemap API response: ${path}`);
  return result.data;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([
    fetchEntries<SitemapArticle>("/articles/sitemap"),
    fetchEntries<SitemapCategory>("/categories"),
  ]);
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const path of ["/", "/about", "/english"]) {
    const url = siteUrl(path);
    entries.set(url, { url });
  }
  for (const category of categories) {
    const slug = category.slug === "screenings" ? "report" : category.slug;
    const url = siteUrl(`/category/${encodeURIComponent(slug)}`);
    entries.set(url, { url });
  }
  for (const article of articles) {
    const url = siteUrl(`/articles/${encodeURIComponent(article.slug)}`);
    entries.set(url, {
      url,
      lastModified: new Date(article.updatedAt || article.publishedAt),
    });
  }
  if (entries.size > 50_000) throw new Error("Sitemap exceeds 50,000 URLs; split it into multiple sitemaps");
  return Array.from(entries.values());
}
