export const siteConfig = {
  name: "ManhwaVerse",
  description:
    "Read top manhwa chapters with a fast, modern, mobile-first reading experience.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/logo.png",
  creator: "ManhwaVerse",
  keywords: [
    "manhwa",
    "webtoon",
    "read manhwa online",
    "manhwaverse",
    "free manhwa",
    "korean comics",
  ],
  links: {
    github: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
