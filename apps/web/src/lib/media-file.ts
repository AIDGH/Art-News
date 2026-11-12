const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"]);
const extensions: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", mp4: "video/mp4", m4v: "video/mp4", webm: "video/webm" };

export function mediaFileType(file: Pick<File, "type" | "name">): string | undefined {
  const type = file.type.toLowerCase().split(";")[0].trim();
  if (allowed.has(type)) return type;
  if (type === "video/x-m4v") return "video/mp4";
  if (!["", "application/octet-stream", "binary/octet-stream", "application/mp4"].includes(type)) return undefined;
  return extensions[file.name.split(".").pop()?.toLowerCase() ?? ""];
}
