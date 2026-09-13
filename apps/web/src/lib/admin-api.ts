export type AdminUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: "AUTHOR" | "EDITOR" | "ADMIN";
};

export type AdminCategory = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  _count?: { articles: number };
};

export type MediaAsset = {
  id: string;
  url: string;
  mimeType: string;
  alt: string;
  credit: string | null;
  caption: string | null;
};

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  lead: string;
  body: string;
  status: "DRAFT" | "IN_REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
  category: AdminCategory;
  coverImage: MediaAsset | null;
  author: Pick<AdminUser, "id" | "displayName" | "username">;
  tags: Array<{ tag: { id: string; title: string; slug: string } }>;
  sources: Array<{
    id: string;
    url: string;
    title: string | null;
    publisher: string | null;
    author: string | null;
    publishedAt: string | null;
  }>;
  homepagePlacements: Array<{ slot: string; displayOrder: number }>;
};

export class AdminApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  const json = (await response.json().catch(() => ({}))) as { message?: string | string[] };
  if (!response.ok) {
    const message = Array.isArray(json.message)
      ? json.message.join("، ")
      : json.message || "انجام عملیات ممکن نشد";
    throw new AdminApiError(message, response.status);
  }
  return json as T;
}
