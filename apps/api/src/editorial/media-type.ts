const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"]);
const extensions: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", mp4: "video/mp4", m4v: "video/mp4", webm: "video/webm" };

// Mobile file pickers may omit MIME or send a generic binary type. This is only
// a candidate type: MediaService still verifies the actual file signature.
export function mediaMimeType(mime: string, filename: string): string | undefined {
  const normalized = mime.toLowerCase().split(";")[0].trim();
  if (allowed.has(normalized)) return normalized;
  if (normalized === "video/x-m4v") return "video/mp4";
  if (!["", "application/octet-stream", "binary/octet-stream", "application/mp4"].includes(normalized)) return undefined;
  return extensions[filename.split(".").pop()?.toLowerCase() ?? ""];
}
