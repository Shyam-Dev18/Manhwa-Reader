import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SeoParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  ogType?: "website" | "article" | "book";
}

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function toSafeDescription(input: string) {
  const normalized = input.trim().replace(/\s+/g, " ");

  if (normalized.length <= 160) {
    return normalized;
  }

  return `${normalized.slice(0, 157).trimEnd()}...`;
}

/**
 * Generate consistent metadata for any page.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  ogType = "website",
}: SeoParams): Metadata {
  const url = toAbsoluteUrl(path);
  const ogImage = toAbsoluteUrl(image || siteConfig.ogImage);
  const safeDescription = toSafeDescription(description);

  return {
    title,
    description: safeDescription,
    keywords: [...siteConfig.keywords],
    openGraph: {
      title,
      description: safeDescription,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: safeDescription,
      images: [ogImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

export function toCanonicalPath(path: string) {
  return toAbsoluteUrl(path);
}
