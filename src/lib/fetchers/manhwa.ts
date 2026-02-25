import dbConnect from "@/lib/mongodb";
import Manhwa from "@/models/Manhwa";
import type { IManhwa } from "@/models/Manhwa";
import { PAGINATION } from "@/config/constants";

/**
 * Projection for manhwa grid cards.
 * Only fetch the fields needed for ManhwaCard — reduces payload.
 */
const CARD_PROJECTION = {
  title: 1,
  slug: 1,
  coverImage: 1,
  status: 1,
  latestChapterNumber: 1,
  rating: 1,
  genres: 1,
  _id: 0,
} as const;

const SITEMAP_PROJECTION = {
  slug: 1,
  updatedAt: 1,
  _id: 0,
} as const;

const SEARCH_PROJECTION = {
  title: 1,
  slug: 1,
  coverImage: 1,
  status: 1,
  latestChapterNumber: 1,
  rating: 1,
  genres: 1,
  score: { $meta: "textScore" },
  _id: 0,
} as const;

const TOP_RATED_PROJECTION = {
  title: 1,
  slug: 1,
  coverImage: 1,
  rating: 1,
  _id: 0,
} as const;

/**
 * Fetch a paginated list of manhwa for the home page grid.
 * Sorted by most recently updated (latest chapter releases first).
 *
 * Uses `.lean()` — returns plain JS objects, not Mongoose documents.
 * This avoids hydration overhead and reduces memory usage by ~5x.
 */
export async function getManhwaList(
  page: number = 1,
  limit: number = PAGINATION.HOME_PAGE_SIZE
) {
  await dbConnect();

  const skip = (page - 1) * limit;

  const [manhwaList, totalCount] = await Promise.all([
    Manhwa.find({ publicationStatus: "published" })
      .select(CARD_PROJECTION)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<
        Pick<
          IManhwa,
          | "title"
          | "slug"
          | "coverImage"
          | "status"
          | "latestChapterNumber"
          | "rating"
          | "genres"
        >[]
      >(),
    Manhwa.countDocuments({ publicationStatus: "published" }),
  ]);

  return {
    data: manhwaList,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
    },
  };
}

/**
 * Fetch a single manhwa by slug.
 * Returns the full document (all fields needed for the detail page).
 * Returns `null` if not found.
 */
export async function getManhwaBySlug(slug: string) {
  await dbConnect();

  const manhwa = await Manhwa.findOne({ slug, publicationStatus: "published" })
    .lean<IManhwa | null>();

  return manhwa;
}

/**
 * Fetch manhwa filtered by status (e.g., "ongoing").
 * Useful for future category/filter pages.
 */
export async function getManhwaByStatus(
  status: IManhwa["status"],
  page: number = 1,
  limit: number = PAGINATION.HOME_PAGE_SIZE
) {
  await dbConnect();

  const skip = (page - 1) * limit;

  const [manhwaList, totalCount] = await Promise.all([
    Manhwa.find({ status, publicationStatus: "published" })
      .select(CARD_PROJECTION)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Manhwa.countDocuments({ status, publicationStatus: "published" }),
  ]);

  return {
    data: manhwaList,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
    },
  };
}

/**
 * Minimal data for sitemap generation.
 * Only fetches slug + updatedAt to avoid overfetching.
 */
export async function getManhwaSitemapEntries() {
  await dbConnect();

  const entries = await Manhwa.find({})
    .where("publicationStatus")
    .equals("published")
    .select(SITEMAP_PROJECTION)
    .sort({ updatedAt: -1 })
    .lean<Pick<IManhwa, "slug" | "updatedAt">[]>();

  return entries;
}

/**
 * Full-text search for manhwa titles/alt titles/genres.
 *
 * - Uses MongoDB $text index
 * - Sorts by text relevance score
 * - Returns minimal card fields only
 * - Caps results at 20 for predictable payload
 */
export async function getSearchResults(query: string) {
  const normalized = query.trim();

  if (!normalized) {
    return [] as Pick<
      IManhwa,
      | "title"
      | "slug"
      | "coverImage"
      | "status"
      | "latestChapterNumber"
      | "rating"
      | "genres"
    >[];
  }

  await dbConnect();

  const results = await Manhwa.find({ $text: { $search: normalized } })
    .where("publicationStatus")
    .equals("published")
    .select(SEARCH_PROJECTION)
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean<
      Pick<
        IManhwa,
        | "title"
        | "slug"
        | "coverImage"
        | "status"
        | "latestChapterNumber"
        | "rating"
        | "genres"
      >[]
    >();

  return results;
}

/**
 * Fetch top-rated manhwa for hero carousel.
 *
 * - Sorted by highest rating first
 * - Minimal fields only
 * - Hard-limited result set for fast payloads
 */
export async function getTopRatedManhwa(limit: number = 5) {
  await dbConnect();

  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));

  const results = await Manhwa.find({})
    .where("publicationStatus")
    .equals("published")
    .select(TOP_RATED_PROJECTION)
    .sort({ rating: -1, updatedAt: -1 })
    .limit(safeLimit)
    .lean<Pick<IManhwa, "title" | "slug" | "coverImage" | "rating">[]>();

  return results;
}

/**
 * Admin-only list fetcher (includes drafts).
 */
export async function getAdminManhwaList(
  page: number = 1,
  limit: number = PAGINATION.HOME_PAGE_SIZE
) {
  await dbConnect();

  const skip = (page - 1) * limit;

  const [manhwaList, totalCount] = await Promise.all([
    Manhwa.find({})
      .select(CARD_PROJECTION)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<
        Pick<
          IManhwa,
          | "title"
          | "slug"
          | "coverImage"
          | "status"
          | "latestChapterNumber"
          | "rating"
          | "genres"
        >[]
      >(),
    Manhwa.countDocuments({}),
  ]);

  return {
    data: manhwaList,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
    },
  };
}

/**
 * Admin-only detail fetcher (includes drafts).
 */
export async function getAdminManhwaBySlug(slug: string) {
  await dbConnect();

  const manhwa = await Manhwa.findOne({ slug }).lean<IManhwa | null>();
  return manhwa;
}
