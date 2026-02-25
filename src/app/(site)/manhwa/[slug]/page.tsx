import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getManhwaBySlug, getChaptersByManhwaSlug } from "@/lib/fetchers";
import { getManhwaSitemapEntries } from "@/lib/fetchers";
import { ManhwaHeader, ManhwaInfo, ChapterList } from "@/components/manhwa";
import { buildMetadata } from "@/utils/seo";
import {
  buildManhwaJsonLd,
  buildBreadcrumbJsonLd,
  serializeJsonLd,
} from "@/utils/structured-data";

interface ManhwaPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

const getCachedManhwaBySlug = cache(getManhwaBySlug);

export async function generateStaticParams() {
  const entries = await getManhwaSitemapEntries();

  return entries.map((entry) => ({ slug: entry.slug }));
}

/**
 * Dynamic SEO metadata — fetches manhwa data for title, description, OG image.
 * Runs on server before the page renders.
 */
export async function generateMetadata({
  params,
}: ManhwaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const manhwa = await getCachedManhwaBySlug(slug);

  if (!manhwa) {
    return { title: "Manhwa Not Found" };
  }

  const description =
    manhwa.synopsis.length > 160
      ? manhwa.synopsis.slice(0, 157) + "..."
      : manhwa.synopsis || `Read ${manhwa.title} online for free.`;

  return buildMetadata({
    title: manhwa.title,
    description,
    path: `/manhwa/${manhwa.slug}`,
    image: manhwa.coverImage,
    ogType: "book",
  });
}

/**
 * Manhwa detail page.
 *
 * Fetches manhwa + chapter list in parallel.
 * Both queries use projections — chapter images[] are NOT fetched.
 */
export default async function ManhwaPage({ params }: ManhwaPageProps) {
  const { slug } = await params;

  // Parallel fetch: manhwa detail + chapter list
  const [manhwa, { data: chapters }] = await Promise.all([
    getCachedManhwaBySlug(slug),
    getChaptersByManhwaSlug(slug),
  ]);

  if (!manhwa) {
    notFound();
  }

  const manhwaJsonLd = buildManhwaJsonLd(manhwa);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: manhwa.title, path: `/manhwa/${manhwa.slug}` },
  ]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(manhwaJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ManhwaHeader manhwa={manhwa} />
      <ManhwaInfo synopsis={manhwa.synopsis} />
      <ChapterList chapters={chapters} />
    </article>
  );
}
