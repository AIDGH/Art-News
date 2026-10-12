export function decodeShortLink(code: string): { kind: "article" | "media"; id: string } | null {
  if (!/^[am][A-Za-z0-9_-]{22}$/.test(code)) return null;
  const bytes = Buffer.from(code.slice(1), "base64url");
  if (bytes.length !== 16 || bytes.toString("base64url") !== code.slice(1)) return null;
  const hex = bytes.toString("hex");
  return {
    kind: code[0] === "a" ? "article" : "media",
    id: `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`,
  };
}
