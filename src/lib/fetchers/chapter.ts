import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Manhwa from "@/models/Manhwa";
import type { IChapter } from "@/models/Chapter";
import { PAGINATION } from "@/config/constants";

/**
 * Projection for chapter list items (shown on manhwa detail page).
 * Excludes the `images` array — it can be massive and isn't needed
 * until the user opens the reader.
 */
const LIST_PROJECTION = {
  chapterNumber: 1,
  title: 1,
  slug: 1,
  createdAt: 1,
  _id: 0,
} as const;

/**
 * Minimal projection for the chapter dropdown in the reader.
 * Only chapterNumber + slug — no images, no dates, no titles.
 */
const DROPDOWN_PROJECTION = {
  chapterNumber: 1,
  slug: 1,
  _id: 0,
} as const;

const SITEMAP_PROJECTION = {
  slug: 1,
  createdAt: 1,
  _id: 0,
} as const;

/**
 * Fetch all chapters for a given manhwa, sorted descending.
 * Used on the manhwa detail page to show the chapter list.
 *
 * Leverages the compound index { manhwaSlug: 1, chapterNumber: 1 }.
 */
export async function getChaptersByManhwaSlug(
  manhwaSlug: string,
  page: number = 1,
  limit: number = PAGINATION.CHAPTER_LIST_SIZE
) {
  await dbConnect();

  const skip = (page - 1) * limit;

  const [chapters, totalCount] = await Promise.all([
    Chapter.find({ manhwaSlug })
      .select(LIST_PROJECTION)
      .sort({ chapterNumber: -1 })
      .skip(skip)
      .limit(limit)
      .lean<
        Pick<IChapter, "chapterNumber" | "title" | "slug" | "createdAt">[]
      >(),
    Chapter.countDocuments({ manhwaSlug }),
  ]);

  return {
    data: chapters,
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
 * Fetch a single chapter by its slug.
 * Returns the full document including images array.
 * Returns `null` if not found.
 */
export async function getChapterBySlug(slug: string) {
  await dbConnect();

  const chapter = await Chapter.findOne({ slug })
    .lean<IChapter | null>();

  return chapter;
}

/**
 * Fetch navigation context for prev/next chapter buttons.
 *
 * Strategy: Query only the slug of the adjacent chapters using
 * the compound index { manhwaSlug, chapterNumber }. Two targeted
 * queries are cheaper than fetching the entire chapter list.
 */
export async function getChapterNavigation(
  manhwaSlug: string,
  currentChapterNumber: number
) {
  await dbConnect();

  const [prevChapter, nextChapter] = await Promise.all([
    // Previous: highest chapterNumber that's less than current
    Chapter.findOne({
      manhwaSlug,
      chapterNumber: { $lt: currentChapterNumber },
    })
      .select({ slug: 1, _id: 0 })
      .sort({ chapterNumber: -1 })
      .lean<{ slug: string } | null>(),

    // Next: lowest chapterNumber that's greater than current
    Chapter.findOne({
      manhwaSlug,
      chapterNumber: { $gt: currentChapterNumber },
    })
      .select({ slug: 1, _id: 0 })
      .sort({ chapterNumber: 1 })
      .lean<{ slug: string } | null>(),
  ]);

  return {
    prevSlug: prevChapter?.slug ?? null,
    nextSlug: nextChapter?.slug ?? null,
  };
}

/**
 * Fetch a lightweight list of all chapter numbers + slugs for a manhwa.
 * Used by the ChapterDropdown in the reader — minimal payload.
 *
 * Sorted ascending (Chapter 1 first) for natural dropdown order.
 * Uses the compound index { manhwaSlug: 1, chapterNumber: 1 }.
 */
export async function getChapterDropdownList(manhwaSlug: string) {
  await dbConnect();

  const chapters = await Chapter.find({ manhwaSlug })
    .select(DROPDOWN_PROJECTION)
    .sort({ chapterNumber: 1 })
    .lean<{ chapterNumber: number; slug: string }[]>();

  return chapters;
}

/**
 * Minimal data for sitemap generation.
 * Only fetches slug + createdAt to avoid overfetching.
 */
export async function getChapterSitemapEntries() {
  await dbConnect();

  const publishedSlugs = await Manhwa.find({ publicationStatus: "published" })
    .select({ slug: 1, _id: 0 })
    .lean<{ slug: string }[]>();

  const entries = await Chapter.find({
    manhwaSlug: { $in: publishedSlugs.map((item) => item.slug) },
  })
    .select(SITEMAP_PROJECTION)
    .sort({ createdAt: -1 })
    .lean<Pick<IChapter, "slug" | "createdAt">[]>();

  return entries;
}
