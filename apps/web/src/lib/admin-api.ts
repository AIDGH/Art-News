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

export type AdminContentBlock = {
  id: string;
  kind: "TEXT" | "IMAGES";
  text: string | null;
  images: Array<{ media: MediaAsset }>;
};

export type AdminAdvertisement = {
  id: string;
  title: string;
  text: string | null;
  targetUrl: string | null;
  media: MediaAsset;
  placement: "ALL" | "HOME" | "ARTICLE" | "CATEGORY";
  enabled: boolean;
  startsAt: string | null;
  endsAt: string | null;
  displayOrder: number;
  effectiveStatus: "ACTIVE" | "SCHEDULED" | "EXPIRED" | "DISABLED";
};

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  lead: string;
  body: string;
  contentBlocks?: AdminContentBlock[];
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

export type AdminSiteSettings = {
  ecranPromoText: string;
  footerDescription: string;
  aboutBody: string;
  updatedAt: string | null;
};

export class AdminApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function errorMessage(status: number, json: { message?: string | string[] }) {
  if (status === 413) return "حجم فایل بیش از حد مجاز است؛ تصویر تا ۸ و ویدیو تا ۳۰ مگابایت مجاز است.";
  if (status === 504 || status === 408) return "ارسال فایل بیش از حد طول کشید؛ اتصال اینترنت را بررسی و دوباره تلاش کنید.";
  return Array.isArray(json.message) ? json.message.join("، ") : json.message || "انجام عملیات ممکن نشد";
}

export function adminUpload<T>(path: string, body: FormData, onProgress: (percent: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `/api/v1${path}`);
    request.withCredentials = true;
    request.timeout = 10 * 60 * 1000;
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100));
    };
    request.onload = () => {
      let json;
      try { json = JSON.parse(request.responseText); } catch { json = {}; }
      if (request.status < 200 || request.status >= 300) {
        reject(new AdminApiError(errorMessage(request.status, json), request.status));
      } else if (!json.data) {
        reject(new Error("پاسخ بارگذاری فایل معتبر نبود؛ دوباره تلاش کنید."));
      } else resolve(json as T);
    };
    request.onerror = () => reject(new Error("ارتباط هنگام بارگذاری فایل قطع شد؛ اتصال اینترنت را بررسی کنید."));
    request.ontimeout = () => reject(new Error("مهلت بارگذاری تمام شد؛ اتصال اینترنت را بررسی و دوباره تلاش کنید."));
    request.onabort = () => reject(new Error("بارگذاری فایل متوقف شد."));
    request.send(body);
  });
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
    const message = errorMessage(response.status, json);
    throw new AdminApiError(message, response.status);
  }
  return json as T;
}
