import { siteConfig } from "@/config/site";
import type { IManhwa } from "@/models/Manhwa";
import type { IChapter } from "@/models/Chapter";

interface BreadcrumbItem {
  name: string;
  path: string;
}

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function serializeJsonLd(payload: unknown) {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildManhwaJsonLd(manhwa: IManhwa) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: manhwa.title,
    url: absoluteUrl(`/manhwa/${manhwa.slug}`),
    image: absoluteUrl(manhwa.coverImage),
    description: manhwa.synopsis,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    bookFormat: "EBook",
    genre: manhwa.genres,
    inLanguage: "en",
    author: manhwa.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    illustrator: manhwa.artists.map((name) => ({
      "@type": "Person",
      name,
    })),
    datePublished: manhwa.releaseYear > 0 ? `${manhwa.releaseYear}` : undefined,
    numberOfPages: manhwa.totalChapters > 0 ? manhwa.totalChapters : undefined,
    aggregateRating:
      manhwa.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: manhwa.rating,
            bestRating: 10,
            worstRating: 0,
            ratingCount: 1,
          }
        : undefined,
  };
}

export function buildChapterJsonLd(chapter: IChapter, manhwaTitle: string) {
  const chapterTitle = chapter.title
    ? `Chapter ${chapter.chapterNumber}: ${chapter.title}`
    : `Chapter ${chapter.chapterNumber}`;

  return {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: chapterTitle,
    url: absoluteUrl(`/chapter/${chapter.slug}`),
    isPartOf: {
      "@type": "Book",
      name: manhwaTitle,
      url: absoluteUrl(`/manhwa/${chapter.manhwaSlug}`),
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    position: chapter.chapterNumber,
    datePublished: chapter.createdAt,
    inLanguage: "en",
  };
}