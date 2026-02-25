import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";

import {
  getChapterBySlug,
  getChapterNavigation,
  getChapterDropdownList,
} from "@/lib/fetchers";
import { getManhwaBySlug } from "@/lib/fetchers";
import { getChapterSitemapEntries } from "@/lib/fetchers";
import { buildMetadata } from "@/utils/seo";
import {
  ReaderImages,
  ChapterDropdown,
  ChapterNavigation,
} from "@/components/reader";
import {
  buildChapterJsonLd,
  buildBreadcrumbJsonLd,
  serializeJsonLd,
} from "@/utils/structured-data";

interface ChapterPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

const getCachedChapterBySlug = cache(getChapterBySlug);
const getCachedManhwaBySlug = cache(getManhwaBySlug);

export async function generateStaticParams() {
  const entries = await getChapterSitemapEntries();

  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getCachedChapterBySlug(slug);

  if (!chapter) {
    return { title: "Chapter Not Found" };
  }

  const manhwa = await getCachedManhwaBySlug(chapter.manhwaSlug);
  if (!manhwa) {
    return { title: "Chapter Not Found" };
  }

  const chapterLabel = chapter.title
    ? `Chapter ${chapter.chapterNumber}: ${chapter.title}`
    : `Chapter ${chapter.chapterNumber}`;

  return buildMetadata({
    title: chapterLabel,
    description: `Read ${chapterLabel} online for free.`,
    path: `/chapter/${chapter.slug}`,
    noIndex: false,
    ogType: "article",
  });
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;

  // ── Primary fetch ─────────────────────────────────────────
  const chapter = await getCachedChapterBySlug(slug);
  if (!chapter) notFound();

  // ── Parallel secondary fetches ────────────────────────────
  const [navigation, dropdownList, manhwa] = await Promise.all([
    getChapterNavigation(chapter.manhwaSlug, chapter.chapterNumber),
    getChapterDropdownList(chapter.manhwaSlug),
    getCachedManhwaBySlug(chapter.manhwaSlug),
  ]);

  if (!manhwa) {
    notFound();
  }

  const manhwaTitle = manhwa.title;
  const chapterLabel = chapter.title
    ? `Ch. ${chapter.chapterNumber}: ${chapter.title}`
    : `Chapter ${chapter.chapterNumber}`;
  const chapterJsonLd = buildChapterJsonLd(chapter, manhwaTitle);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: manhwaTitle, path: `/manhwa/${chapter.manhwaSlug}` },
    { name: chapterLabel, path: `/chapter/${chapter.slug}` },
  ]);

  return (
    <section className="mx-auto max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(chapterJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {/* ── Reader header ──────────────────────────────────── */}
      <header className="space-y-3 px-4 pt-6 pb-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link
            href={`/manhwa/${chapter.manhwaSlug}`}
            className="truncate transition-colors hover:text-violet-400"
          >
            {manhwaTitle}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-gray-300">{chapterLabel}</span>
        </nav>

        {/* Title + Dropdown row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-bold text-gray-100 sm:text-xl">
            {chapterLabel}
          </h1>
          <ChapterDropdown
            chapters={dropdownList}
            currentSlug={chapter.slug}
          />
        </div>
      </header>

      {/* ── Images ─────────────────────────────────────────── */}
      <ReaderImages images={chapter.images} chapterTitle={chapterLabel} />

      {/* ── Bottom navigation ──────────────────────────────── */}
      <ChapterNavigation
        prevSlug={navigation.prevSlug}
        nextSlug={navigation.nextSlug}
        manhwaSlug={chapter.manhwaSlug}
      />
    </section>
  );
}
