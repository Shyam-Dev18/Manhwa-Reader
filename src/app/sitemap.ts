import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  getManhwaSitemapEntries,
  getChapterSitemapEntries,
} from "@/lib/fetchers";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [manhwaEntries, chapterEntries] = await Promise.all([
    getManhwaSitemapEntries(),
    getChapterSitemapEntries(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: new URL("/", siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: new URL("/privacy", siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: new URL("/dmca", siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const manhwaRoutes: MetadataRoute.Sitemap = manhwaEntries.map((entry) => ({
    url: new URL(`/manhwa/${entry.slug}`, siteConfig.url).toString(),
    lastModified: entry.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const chapterRoutes: MetadataRoute.Sitemap = chapterEntries.map((entry) => ({
    url: new URL(`/chapter/${entry.slug}`, siteConfig.url).toString(),
    lastModified: entry.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...manhwaRoutes, ...chapterRoutes];
}