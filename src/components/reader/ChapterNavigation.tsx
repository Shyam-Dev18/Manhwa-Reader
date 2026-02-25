import Link from "next/link";

interface ChapterNavigationProps {
  prevSlug: string | null;
  nextSlug: string | null;
  manhwaSlug: string;
}

/**
 * Prev / Next chapter navigation.
 *
 * Renders in two places:
 *   1. Inline (top of reader, below header)
 *   2. Sticky bottom bar (mobile-optimized, always accessible)
 *
 * Server component — pure links, no JS needed.
 */
export default function ChapterNavigation({
  prevSlug,
  nextSlug,
  manhwaSlug,
}: ChapterNavigationProps) {
  return (
    <>
      {/* ─── Sticky bottom bar (mobile-first, always visible) ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 
                   bg-gray-950/95 backdrop-blur-sm safe-bottom"
        aria-label="Chapter navigation"
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-4">
          {/* Previous */}
          {prevSlug ? (
            <Link
              href={`/chapter/${prevSlug}`}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg 
                         bg-gray-800 text-sm font-medium text-gray-200 
                         transition-colors hover:bg-gray-700 active:bg-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Prev
            </Link>
          ) : (
            <span className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-800/50 text-sm text-gray-600">
              Prev
            </span>
          )}

          {/* Manhwa home link */}
          <Link
            href={`/manhwa/${manhwaSlug}`}
            className="flex h-10 items-center justify-center rounded-lg bg-gray-800 px-3 
                       text-sm font-medium text-violet-400 
                       transition-colors hover:bg-gray-700 active:bg-gray-600"
            aria-label="Back to manhwa page"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </Link>

          {/* Next */}
          {nextSlug ? (
            <Link
              href={`/chapter/${nextSlug}`}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg
                         bg-violet-600 text-sm font-medium text-white 
                         transition-colors hover:bg-violet-500 active:bg-violet-700"
            >
              Next
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ) : (
            <span className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-800/50 text-sm text-gray-600">
              Next
            </span>
          )}
        </div>
      </nav>

      {/* Bottom padding to prevent content from hiding behind the fixed bar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
