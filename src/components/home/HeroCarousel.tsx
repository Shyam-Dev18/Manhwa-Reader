"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { siteConfig } from "@/config/site";
import { buildWeservUrl } from "@/utils/images";

interface HeroSlide {
  title: string;
  slug: string;
  coverImage: string;
  rating: number;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;

    const timer = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [emblaApi, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-xl border border-gray-800 bg-linear-to-br from-gray-900 via-gray-900 to-violet-950">
        <div className="relative px-5 py-10 text-center sm:px-8 sm:py-14 lg:py-16">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Welcome to <span className="text-violet-400">{siteConfig.name}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
            {siteConfig.description}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((item, index) => {
            const coverSrc = buildWeservUrl(item.coverImage) || item.coverImage;

            return (
              <Link
                key={item.slug}
                href={`/manhwa/${item.slug}`}
                className="relative min-w-0 flex-[0_0_100%]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gray-800 sm:aspect-21/9">
                  <Image
                    src={coverSrc}
                    alt={`${item.title} cover`}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="hero-kenburns object-cover"
                  />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="inline-flex items-center rounded-full bg-yellow-500/90 px-2.5 py-1 text-xs font-semibold text-gray-950">
                    ★ {item.rating.toFixed(1)}
                  </div>
                  <h1 className="mt-2 line-clamp-2 text-xl font-bold text-white sm:text-3xl">
                    {item.title}
                  </h1>
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
