"use client";

import { useState } from "react";
import { shortLinkPath } from "@/lib/short-links";

export function CopyShortLink({ id, kind = "article" }: { id: string; kind?: "article" | "media" }) {
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState("");
  const path = shortLinkPath(id, kind);
  if (!path) return null;
  const copy = async () => {
    const link = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setManualLink("");
    } catch {
      setManualLink(link);
    }
  };
  return <span className="admin-short-link">
    <button type="button" className="admin-secondary-button" onClick={() => void copy()} aria-label="کپی لینک کوتاه برای اشتراک‌گذاری">{copied ? "لینک کپی شد" : "کپی لینک کوتاه"}</button>
    <span role="status" className="sr-only">{copied ? "لینک کوتاه کپی شد." : ""}</span>
    {manualLink ? <label>این لینک را کپی کنید:<input aria-label="لینک کوتاه" dir="ltr" readOnly value={manualLink} onFocus={(event) => event.currentTarget.select()} /></label> : null}
  </span>;
}
