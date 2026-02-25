import type { MANHWA_STATUS } from "@/config/constants";

/** Possible manhwa status values */
export type ManhwaStatus =
  (typeof MANHWA_STATUS)[keyof typeof MANHWA_STATUS];

/** Chapter image with dimensions for CLS prevention */
export interface ChapterImage {
  url: string;
  width: number;
  height: number;
  order: number;
}

/** Core Manhwa document shape */
export interface Manhwa {
  _id?: string;
  title: string;
  alternativeTitles: string[];
  slug: string;
  publicationStatus?: "draft" | "published";
  status: ManhwaStatus;
  rating: number;
  synopsis: string;
  authors: string[];
  artists: string[];
  genres: string[];
  studio: string;
  releaseYear: number;
  coverImage: string;
  bannerImage?: string;
  totalChapters: number;
  latestChapterNumber: number;
  externalSourceUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/** Minimal manhwa data for cards/grids */
export interface ManhwaCard {
  title: string;
  slug: string;
  coverImage: string;
  status: ManhwaStatus;
  latestChapterNumber: number;
  rating: number;
  genres: string[];
}
