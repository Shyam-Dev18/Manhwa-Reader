"use client";

import { useRouter } from "next/navigation";

interface ChapterDropdownProps {
  chapters: { chapterNumber: number; slug: string }[];
  currentSlug: string;
}

/**
 * Chapter selector dropdown for the reader.
 * Client component — needs router.push for navigation.
 *
 * Receives a pre-fetched lightweight list (number + slug only).
 * Mobile: full-width select. Desktop: compact inline.
 */
export default function ChapterDropdown({
  chapters,
  currentSlug,
}: ChapterDropdownProps) {
  const router = useRouter();

  return (
    <select
      value={currentSlug}
      onChange={(e) => router.push(`/chapter/${e.target.value}`)}
      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500 sm:w-auto"
      aria-label="Select chapter"
    >
      {chapters.map((ch) => (
        <option key={ch.slug} value={ch.slug}>
          Chapter {ch.chapterNumber}
        </option>
      ))}
    </select>
  );
}
