"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { imageSourcePath } from "@/lib/uploaded-image";

export default function NewsImage({ src, alt, onError, unoptimized, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = typeof src === "string" ? imageSourcePath(src) : null;
  const failed = source !== null && failedSource === source;

  return <Image
    {...props}
    alt={alt}
    src={source && !failed && !unoptimized ? source : src}
    unoptimized={unoptimized || failed || (typeof src === "string" && src.startsWith("/uploads/") && !source)}
    onError={(event) => {
      // Keep the original available if image processing is temporarily unavailable.
      if (source && !failed && !unoptimized) setFailedSource(source);
      onError?.(event);
    }}
  />;
}
