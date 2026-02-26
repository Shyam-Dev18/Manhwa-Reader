import type { Metadata } from "next";
import {
  getManhwaList,
  getTopRatedManhwa,
  getTopRatedManhwaGrid,
} from "@/lib/fetchers";
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
  const [{ data: manhwaList }, topRated, topRatedGrid] = await Promise.all([
    getManhwaList(1, 10),
    getTopRatedManhwa(5),
    getTopRatedManhwaGrid(20),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <HeroCarousel slides={topRated} />

      <div className="mt-5">
        <SearchBar />
      </div>

      {/* Latest Updates Grid */}
      <div className="mt-8 rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4 shadow-[0_18px_50px_rgba(14,116,144,0.18)] sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-sky-200 sm:text-xl">
            Latest Updates
          </h2>
          <div className="mt-2 h-[3px] w-32 bg-linear-to-r from-sky-400 via-blue-400 to-transparent" />
        </div>
        <ManhwaGrid manhwaList={manhwaList} />
      </div>

      {/* Manhwas Grid (Top Rated) */}
      <div className="mt-8 rounded-2xl border border-blue-500/20 bg-slate-900/70 p-4 shadow-[0_18px_50px_rgba(37,99,235,0.18)] sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-blue-200 sm:text-xl">
            Manhwas
          </h2>
          <div className="mt-2 h-[3px] w-28 bg-linear-to-r from-blue-400 via-cyan-400 to-transparent" />
        </div>
        <ManhwaGrid manhwaList={topRatedGrid} />
      </div>
    </section>
  );
}
