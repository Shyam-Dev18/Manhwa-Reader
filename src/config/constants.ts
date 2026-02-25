/** Navigation links shown in header/navbar */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Privacy", href: "/privacy" },
  { label: "DMCA", href: "/dmca" },
] as const;

/** Manhwa status options */
export const MANHWA_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  HIATUS: "hiatus",
  DROPPED: "dropped",
} as const;

/** Revalidation times in seconds (ISR) */
export const REVALIDATE = {
  HOME: 60,
  MANHWA_PAGE: 300,
  CHAPTER_PAGE: 3600,
} as const;

/** Image fallback paths */
export const FALLBACK_IMAGES = {
  COVER: "/images/fallback-cover.png",
  CHAPTER: "/images/fallback-page.png",
} as const;

/** Pagination defaults */
export const PAGINATION = {
  HOME_PAGE_SIZE: 20,
  CHAPTER_LIST_SIZE: 50,
} as const;
