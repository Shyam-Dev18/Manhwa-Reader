/**
 * Loading skeleton for the manhwa detail page.
 * Shown while the async page component resolves.
 *
 * Mirrors the layout of ManhwaHeader + ManhwaInfo + ChapterList
 * to prevent layout shift when data arrives.
 */
export default function ManhwaLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-6 sm:py-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        {/* Cover placeholder */}
        <div className="mx-auto w-48 shrink-0 sm:mx-0 sm:w-52 md:w-56">
          <div className="aspect-[3/4] rounded-lg bg-gray-800" />
        </div>

        {/* Info placeholder */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Title */}
          <div className="h-8 w-3/4 rounded bg-gray-800" />
          {/* Alt titles */}
          <div className="h-4 w-1/2 rounded bg-gray-800/60" />
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded bg-gray-800" />
            <div className="h-5 w-12 rounded bg-gray-800" />
            <div className="h-5 w-20 rounded bg-gray-800" />
          </div>
          {/* Genre pills */}
          <div className="flex gap-1.5">
            <div className="h-5 w-14 rounded-full bg-gray-800/50" />
            <div className="h-5 w-16 rounded-full bg-gray-800/50" />
            <div className="h-5 w-12 rounded-full bg-gray-800/50" />
          </div>
          {/* Metadata grid */}
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <div className="h-3 w-10 rounded bg-gray-800/40" />
              <div className="h-4 w-20 rounded bg-gray-800" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-10 rounded bg-gray-800/40" />
              <div className="h-4 w-20 rounded bg-gray-800" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-10 rounded bg-gray-800/40" />
              <div className="h-4 w-20 rounded bg-gray-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis skeleton */}
      <div className="mt-6 space-y-2">
        <div className="h-5 w-24 rounded bg-gray-800" />
        <div className="space-y-1.5">
          <div className="h-4 w-full rounded bg-gray-800/50" />
          <div className="h-4 w-full rounded bg-gray-800/50" />
          <div className="h-4 w-3/4 rounded bg-gray-800/50" />
        </div>
      </div>

      {/* Chapter list skeleton */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-gray-800" />
          <div className="h-4 w-16 rounded bg-gray-800/40" />
        </div>
        <div className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[44px] items-center justify-between px-4 py-3"
            >
              <div className="h-4 w-28 rounded bg-gray-800" />
              <div className="h-3 w-14 rounded bg-gray-800/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
