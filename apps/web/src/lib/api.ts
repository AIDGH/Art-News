import { Article, type Category } from "./news";

export const API_BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:4001/api/v1").replace(/\/$/, "");

export type SiteSettings = {
  footerDescription: string;
  aboutBody: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  footerDescription:
    "پایگاه خبری سینما نمایش، رسانه انتشار تازه‌ترین و مهم‌ترین اخبار فرهنگی است",
  aboutBody: "",
};

type ApiArticle = {
  slug: string;
  title: string;
  lead: string;
  body: string;
  category: Category;
  coverImage?: { url: string; alt: string; credit?: string | null } | null;
  publishedAt: string;
  author?: { displayName?: string; username?: string };
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags?: Array<{ tag: { slug: string; title: string } }>;
  sources?: Array<{ url: string; title?: string | null; publisher?: string | null }>;
};

export function mapApiArticleToUi(apiArticle: ApiArticle): Article {
  return {
    slug: apiArticle.slug,
    title: apiArticle.title,
    lead: apiArticle.lead,
    category: apiArticle.category,
    imageUrl: apiArticle.coverImage?.url || "/images/placeholder.jpg",
    imageAlt: apiArticle.coverImage?.alt || "",
    imageCredit: apiArticle.coverImage?.credit || "",
    publishedAt: apiArticle.publishedAt,
    publishedLabel: new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(apiArticle.publishedAt)),
    readingTime: `${Math.max(1, Math.ceil(apiArticle.body.trim().split(/\s+/).length / 220)).toLocaleString("fa-IR")} دقیقه`,
    author: apiArticle.author?.displayName || apiArticle.author?.username || "",
    body: (apiArticle.body || "").split(/\n\s*\n/).filter(Boolean),
    seoTitle: apiArticle.seoTitle || undefined,
    seoDescription: apiArticle.seoDescription || undefined,
    tags: apiArticle.tags?.map(({ tag }) => tag) || [],
    sources: apiArticle.sources?.map((source) => ({
      url: source.url,
      title: source.title || undefined,
      publisher: source.publisher || undefined,
    })) || [],
  };
}

export async function fetchFeaturedArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/featured`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const json = (await response.json()) as { data?: ApiArticle[] };
    return (json.data || []).map(mapApiArticleToUi);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 60 } });
    if (!response.ok) return undefined;
    const json = (await response.json()) as { data?: Array<Category & { articleCount: number }> };
    return json.data?.find((category) => category.slug === slug);
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return undefined;
  }
}

export async function fetchArticles(params?: { category?: string; query?: string; pageSize?: number }): Promise<Article[]> {
  const url = new URL(`${API_BASE_URL}/articles`);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.query) url.searchParams.set("query", params.query);
  url.searchParams.set("pageSize", (params?.pageSize || 30).toString());

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map(mapApiArticleToUi);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return undefined;
    const json = await res.json();
    if (!json.data) return undefined;
    return mapApiArticleToUi(json.data);
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return undefined;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return DEFAULT_SITE_SETTINGS;
    const json = (await response.json()) as { data?: SiteSettings };
    return json.data ?? DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}
