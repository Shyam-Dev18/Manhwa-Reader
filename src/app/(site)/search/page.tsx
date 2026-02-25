import type { Metadata } from "next";
import { getSearchResults } from "@/lib/fetchers";
import { SearchBar } from "@/components/home";
import { ManhwaGrid } from "@/components/manhwa";
import { buildMetadata } from "@/utils/seo";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search manhwa by title, alternate titles, or genres.",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await getSearchResults(query) : [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <h1 className="text-xl font-bold text-gray-100 sm:text-2xl">Search</h1>

      <div className="mt-4">
        <SearchBar initialQuery={query} />
      </div>

      {!query ? (
        <p className="mt-6 rounded-lg border border-gray-800 bg-gray-900 px-4 py-8 text-center text-sm text-gray-400">
          Enter a keyword to search by title, alt title, or genre.
        </p>
      ) : results.length === 0 ? (
        <p className="mt-6 rounded-lg border border-gray-800 bg-gray-900 px-4 py-8 text-center text-sm text-gray-400">
          No results found for “{query}”.
        </p>
      ) : (
        <div className="mt-6">
          <p className="mb-3 text-sm text-gray-400">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for “{query}”
          </p>
          <ManhwaGrid manhwaList={results} />
        </div>
      )}
    </section>
  );
}
