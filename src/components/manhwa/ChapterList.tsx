import Link from "next/link";
import type { ChapterListItem } from "@/types";
import { timeAgo } from "@/utils/format";

interface ChapterListProps {
  chapters: ChapterListItem[];
  manhwaSlug: string;
}

/**
 * Chapter list for the manhwa detail page.
 * Server component — renders a sorted list of chapter links.
 *
 * Mobile-first:
 *   - Full-width rows with generous tap targets (min 44px height)
 *   - Chapter number left, date right
 */
export default function ChapterList({
  chapters,
  manhwaSlug,
}: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold text-gray-100">
          Chapters
        </h2>
        <p className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-8 text-center text-sm text-gray-500">
          No chapters available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-100">Chapters</h2>
        <span className="text-xs text-gray-500">
          {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ul className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900 [content-visibility:auto] [contain-intrinsic-size:1px_800px]">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/chapter/${chapter.slug}`}
              className="flex min-h-[44px] items-center justify-between gap-3 px-4 py-3 
                         transition-colors hover:bg-gray-800/60"
            >
              {/* Chapter label */}
              <span className="text-sm font-medium text-gray-200">
                Chapter {chapter.chapterNumber}
                {chapter.title && (
                  <span className="ml-1.5 font-normal text-gray-400">
                    — {chapter.title}
                  </span>
                )}
              </span>

              {/* Relative time */}
              <time
                dateTime={
                  typeof chapter.createdAt === "string"
                    ? chapter.createdAt
                    : new Date(chapter.createdAt).toISOString()
                }
                className="shrink-0 text-xs text-gray-500"
              >
                {timeAgo(
                  typeof chapter.createdAt === "string"
                    ? chapter.createdAt
                    : new Date(chapter.createdAt).toISOString()
                )}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
