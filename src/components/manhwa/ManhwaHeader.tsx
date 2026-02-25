import Image from "next/image";
import type { Manhwa } from "@/types";

interface ManhwaHeaderProps {
  manhwa: Manhwa;
}

/**
 * Hero header for the manhwa detail page.
 * Server component — zero client JS.
 *
 * Mobile-first:
 *   - Mobile: stacked layout (cover above, info below)
 *   - Desktop: side-by-side (cover left, info right)
 */
export default function ManhwaHeader({ manhwa }: ManhwaHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
      {/* Cover image — fixed aspect ratio */}
      <div className="mx-auto w-48 shrink-0 sm:mx-0 sm:w-52 md:w-56">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-gray-800 shadow-lg shadow-black/30">
          <Image
            src={manhwa.coverImage}
            alt={`${manhwa.title} cover`}
            fill
            sizes="(max-width: 640px) 192px, (max-width: 768px) 208px, 224px"
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Title + key metadata */}
      <div className="flex flex-1 flex-col">
        <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
          {manhwa.title}
        </h1>

        {manhwa.alternativeTitles.length > 0 && (
          <p className="mt-1 text-sm italic text-gray-400">
            {manhwa.alternativeTitles.join(" / ")}
          </p>
        )}

        {/* Metadata badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Status */}
          <span
            className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide
              ${
                manhwa.status === "ongoing"
                  ? "bg-green-600/20 text-green-400 ring-1 ring-green-500/30"
                  : manhwa.status === "completed"
                  ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30"
                  : manhwa.status === "hiatus"
                  ? "bg-yellow-600/20 text-yellow-400 ring-1 ring-yellow-500/30"
                  : "bg-red-600/20 text-red-400 ring-1 ring-red-500/30"
              }`}
          >
            {manhwa.status}
          </span>

          {/* Rating */}
          {manhwa.rating > 0 && (
            <span className="flex items-center gap-1 rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-yellow-400">
              <svg
                className="h-3 w-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {manhwa.rating.toFixed(1)}
            </span>
          )}

          {/* Chapters count */}
          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
            {manhwa.totalChapters} Chapters
          </span>
        </div>

        {/* Genres */}
        {manhwa.genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {manhwa.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-violet-600/15 px-2.5 py-0.5 text-[11px] font-medium text-violet-300 ring-1 ring-violet-500/20"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Quick info row */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          {manhwa.authors.length > 0 && (
            <div>
              <dt className="text-xs text-gray-500">Author</dt>
              <dd className="text-gray-300">{manhwa.authors.join(", ")}</dd>
            </div>
          )}
          {manhwa.artists.length > 0 && (
            <div>
              <dt className="text-xs text-gray-500">Artist</dt>
              <dd className="text-gray-300">{manhwa.artists.join(", ")}</dd>
            </div>
          )}
          {manhwa.studio && (
            <div>
              <dt className="text-xs text-gray-500">Studio</dt>
              <dd className="text-gray-300">{manhwa.studio}</dd>
            </div>
          )}
          {manhwa.releaseYear > 0 && (
            <div>
              <dt className="text-xs text-gray-500">Released</dt>
              <dd className="text-gray-300">{manhwa.releaseYear}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
