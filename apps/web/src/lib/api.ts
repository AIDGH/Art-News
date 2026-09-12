import { Article } from "./news";

export const API_BASE_URL = "http://localhost:4001/api/v1";

export function mapApiArticleToUi(apiArticle: any): Article {
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
    readingTime: "۳ دقیقه", // Mock reading time for now
    author: apiArticle.author?.displayName || apiArticle.author?.username || "",
    body: [apiArticle.body || ""],
  };
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
