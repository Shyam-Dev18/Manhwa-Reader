import type { Metadata } from "next";
import { getManhwaList, getTopRatedManhwa } from "@/lib/fetchers";
import { HeroCarousel, SearchBar } from "@/components/home";
import { ManhwaGrid } from "@/components/manhwa";
import { buildMetadata } from "@/utils/seo";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description:
    "Read your favorite manhwa online for free. High-quality chapters updated daily.",
  path: "/",
});

export const revalidate = 60;

export default async function HomePage() {
  const [{ data: manhwaList }, topRated] = await Promise.all([
    getManhwaList(),
    getTopRatedManhwa(5),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <HeroCarousel slides={topRated} />

      <div className="mt-5">
        <SearchBar />
      </div>

      {/* Latest Updates Grid */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-100 sm:text-xl">
          Latest Updates
        </h2>
        <ManhwaGrid manhwaList={manhwaList} />
      </div>
    </section>
  );
}
