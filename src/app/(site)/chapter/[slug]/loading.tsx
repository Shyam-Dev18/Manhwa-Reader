export default function ChapterLoading() {
  return (
    <section className="mx-auto max-w-4xl animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3 px-4 pt-6 pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-28 rounded bg-gray-800" />
          <span className="text-xs text-gray-700">/</span>
          <div className="h-3 w-20 rounded bg-gray-800" />
        </div>

        {/* Title + dropdown row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-48 rounded bg-gray-800" />
          <div className="h-9 w-40 rounded-lg bg-gray-800" />
        </div>
      </div>

      {/* Image skeletons — simulate 3 page panels */}
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full bg-gray-900"
            style={{ aspectRatio: "2/3" }}
          />
        ))}
      </div>
    </section>
  );
}
