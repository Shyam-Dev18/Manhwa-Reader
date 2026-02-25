import { siteConfig } from "@/config/site";

/**
 * Hero section for the Home page.
 * Server component — no client JS.
 *
 * Mobile-first: single column, centered text.
 * Desktop: wider padding, larger typography.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 border border-gray-800">
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full 
                   bg-violet-600/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative px-5 py-10 text-center sm:px-8 sm:py-14 lg:py-16">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Welcome to{" "}
          <span className="text-violet-400">{siteConfig.name}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
          {siteConfig.description}
        </p>
      </div>
    </section>
  );
}
