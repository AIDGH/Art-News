import type { MediaAsset } from "./admin-api";

export type MediaPost = {
  id: string;
  title: string;
  description: string | null;
  targetUrl: string | null;
  kind: "PHOTOS" | "VIDEOS";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  cover: MediaAsset;
  items: Array<{ id: string; position: number; media: MediaAsset }>;
  publishedAt: string | null;
};

export type MediaPostPage = {
  data: MediaPost[];
  meta: { page: number; pageSize: number; total: number; hasMore: boolean };
};
