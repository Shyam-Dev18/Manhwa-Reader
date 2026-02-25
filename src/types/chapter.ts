import type { ChapterImage } from "./manhwa";

/** Core Chapter document shape */
export interface Chapter {
  _id?: string;
  manhwaSlug: string;
  chapterNumber: number;
  title?: string;
  slug: string;
  images: ChapterImage[];
  createdAt: string | Date;
}

/** Minimal chapter data for chapter lists */
export interface ChapterListItem {
  chapterNumber: number;
  title?: string;
  slug: string;
  createdAt: string | Date;
}

/** Navigation context for prev/next buttons */
export interface ChapterNavigation {
  current: Chapter;
  prevSlug: string | null;
  nextSlug: string | null;
  manhwaTitle: string;
  manhwaSlug: string;
  totalChapters: number;
}
