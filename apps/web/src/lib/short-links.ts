export function shortLinkPath(id: string, kind: "article" | "media" = "article"): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return "";
  const bytes = id.replaceAll("-", "").match(/.{2}/g)!.map((hex) => String.fromCharCode(parseInt(hex, 16))).join("");
  const code = btoa(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  return `/p/${kind === "article" ? "a" : "m"}${code}`;
}

export function isPublishedForSharing(status: string, publishedAt: string | null): boolean {
  return ["PUBLISHED", "SCHEDULED"].includes(status) && Boolean(publishedAt) && new Date(publishedAt!).getTime() <= Date.now();
}
