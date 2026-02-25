import Link from "next/link";
import type { ManhwaCard as ManhwaCardType } from "@/types";

interface ManhwaCardProps {
  manhwa: ManhwaCardType;
  priority?: boolean;
}

/**
 * Single manhwa card for the grid.
 * Server component — zero client JS.
 *
 * Mobile-first: full-width image, compact info.
 * Desktop: fixed aspect ratio in grid columns.
 */
export default function ManhwaCard({ manhwa, priority = false }: ManhwaCardProps) {
  return (
    <Link
      href={`/manhwa/${manhwa.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg 
                 bg-gray-900 transition-transform duration-200 hover:scale-[1.02] 
                 hover:shadow-lg hover:shadow-violet-500/10"
    >
      {/* Cover image container — 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-800">
        <img
          src={manhwa.coverImage}
          alt={`${manhwa.title} cover`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status badge */}
        <span
          className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide
            ${
              manhwa.status === "ongoing"
                ? "bg-green-600/90 text-white"
                : manhwa.status === "completed"
                ? "bg-blue-600/90 text-white"
                : manhwa.status === "hiatus"
                ? "bg-yellow-600/90 text-white"
                : "bg-red-600/90 text-white"
            }`}
        >
          {manhwa.status}
        </span>

        {/* Latest chapter badge */}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-gray-200">
          Ch. {manhwa.latestChapterNumber}
        </span>
      </div>

      {/* Info section */}
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-100 group-hover:text-violet-400">
          {manhwa.title}
        </h3>

        {/* Rating + top genre */}
        <div className="mt-auto flex items-center gap-2 text-[11px] text-gray-400">
          {manhwa.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <svg
                className="h-3 w-3 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {manhwa.rating.toFixed(1)}
            </span>
          )}
          {manhwa.genres.length > 0 && (
            <span className="truncate">{manhwa.genres[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
