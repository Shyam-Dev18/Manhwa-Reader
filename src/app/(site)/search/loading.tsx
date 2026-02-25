export default function SearchLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="h-7 w-28 animate-pulse rounded bg-gray-800" />

      <div className="mt-4 flex items-center gap-2">
        <div className="h-11 w-full animate-pulse rounded-lg bg-gray-800" />
        <div className="h-11 w-24 animate-pulse rounded-lg bg-gray-800" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="aspect-3/4 w-full animate-pulse rounded-lg bg-gray-800" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-gray-800" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-gray-800" />
          </div>
        ))}
      </div>
    </section>
  );
}
