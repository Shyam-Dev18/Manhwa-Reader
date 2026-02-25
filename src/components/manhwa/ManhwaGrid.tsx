import type { ManhwaCard as ManhwaCardType } from "@/types";
import ManhwaCard from "./ManhwaCard";

interface ManhwaGridProps {
  manhwaList: ManhwaCardType[];
}

/**
 * Responsive grid of manhwa cards.
 * Server component — zero client JS.
 *
 * Mobile-first breakpoints:
 *   - Mobile:  2 columns (compact, thumb-friendly)
 *   - Tablet:  3 columns
 *   - Desktop: 4-5 columns
 */
export default function ManhwaGrid({ manhwaList }: ManhwaGridProps) {
  if (manhwaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-gray-400">No manhwa found</p>
        <p className="mt-1 text-sm text-gray-500">
          Check back later for new releases.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 [content-visibility:auto] [contain-intrinsic-size:1px_1200px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {manhwaList.map((manhwa, index) => (
        <ManhwaCard key={manhwa.slug} manhwa={manhwa} priority={index === 0} />
      ))}
    </div>
  );
}
