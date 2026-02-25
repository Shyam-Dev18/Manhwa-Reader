/**
 * Development seed script.
 *
 * Inserts 10 manhwa with 3–6 chapters each into MongoDB.
 * Uses stable external placeholder images in vertical format.
 *
 * Usage:  npm run seed
 * Reset:  npm run seed   (drops existing seed data first)
 *
 * NOTE: This script uses relative imports (not @/ aliases)
 *       so it can run standalone via tsx without Next.js context.
 */

import dotenv from "dotenv";
import path from "path";

// Load .env.local (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import "../src/models/Manhwa";
import "../src/models/Chapter";
import "../src/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ─── Seed Data ───────────────────────────────────────────────────

const coverImg = (id: number) =>
  `https://picsum.photos/seed/manhwa-cover-${id}/400/600`;

const chapterImg = (seed: string, page: number) =>
  `https://picsum.photos/seed/${seed}-p${page}/720/1080`;

/**
 * Real manhuaus sample images — cycled across chapters for variety.
 * These are stable webp pages from manhuaus CDN.
 */
const REAL_PAGES = [
  "https://img.manhuaus.com/image2025/manga_6540ffc2349fa/0434a9e5ccf49c34a20301c30edbf708/001.webp",
  "https://img.manhuaus.com/image2025/manga_6540ffc2349fa/0434a9e5ccf49c34a20301c30edbf708/002.webp",
  "https://img.manhuaus.com/image2025/manga_6540ffc2349fa/0434a9e5ccf49c34a20301c30edbf708/003.webp",
  "https://img.manhuaus.com/image2025/manga_6540ffc2349fa/0434a9e5ccf49c34a20301c30edbf708/004.webp",
  "https://img.manhuaus.com/image2025/manga_6540ffc2349fa/0434a9e5ccf49c34a20301c30edbf708/005.webp",
  "https://img.manhuaus.com/image2025/manga_6540ffc2349fa/0434a9e5ccf49c34a20301c30edbf708/006.webp",
];

const MANHWA_SEED = [
  {
    title: "Shadow Monarch",
    alternativeTitles: ["The Shadow King", "Ruler of Shadows"],
    slug: "shadow-monarch",
    status: "ongoing" as const,
    rating: 8.7,
    synopsis:
      "After awakening as the weakest hunter, Jin discovers a hidden power that lets him command an army of shadow soldiers. As dungeons spread across the world, he must grow stronger to protect humanity — but the shadows have plans of their own.",
    authors: ["Park Sung-ho"],
    artists: ["Kim Jae-won"],
    genres: ["Action", "Fantasy", "Adventure"],
    studio: "Redice Studio",
    releaseYear: 2024,
    coverImage: coverImg(1),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-1/1200/400`,
    totalChapters: 5,
    latestChapterNumber: 5,
  },
  {
    title: "Crimson Blade Chronicles",
    alternativeTitles: ["Red Sword Saga"],
    slug: "crimson-blade-chronicles",
    status: "ongoing" as const,
    rating: 9.1,
    synopsis:
      "In a world where martial artists channel elemental ki, a disgraced swordsman picks up a cursed crimson blade — the only weapon capable of slaying the immortal warlords terrorizing the land. Each swing costs a piece of his soul.",
    authors: ["Lee Min-jun"],
    artists: ["Choi Seo-yeon"],
    genres: ["Action", "Drama", "Martial Arts"],
    studio: "Ylab",
    releaseYear: 2025,
    coverImage: coverImg(2),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-2/1200/400`,
    totalChapters: 4,
    latestChapterNumber: 4,
  },
  {
    title: "The Immortal Regressor",
    alternativeTitles: ["Infinite Return", "Loop of the Undying"],
    slug: "the-immortal-regressor",
    status: "ongoing" as const,
    rating: 9.3,
    synopsis:
      "Kang Tae-yang has died 999 times trying to clear the Tower of Fate. On his 1,000th regression, he returns with the memories of every past life — and a fury that can shake the heavens. This time, he plays by no one's rules.",
    authors: ["Jung Hyun-woo"],
    artists: ["Bae So-ra"],
    genres: ["Action", "Fantasy", "Regression"],
    studio: "Naver Webtoon",
    releaseYear: 2024,
    coverImage: coverImg(3),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-3/1200/400`,
    totalChapters: 6,
    latestChapterNumber: 6,
  },
  {
    title: "Celestial Demon Path",
    alternativeTitles: ["Way of the Heavenly Devil"],
    slug: "celestial-demon-path",
    status: "completed" as const,
    rating: 8.4,
    synopsis:
      "Born in the lowest caste of a cultivation world, Yeon Baek steals a forbidden demonic technique and rises through a society that tried to erase him. His path is paved with betrayal, blood, and a destiny that terrifies even the immortals.",
    authors: ["Choi Dong-hyun"],
    artists: ["Nam Gi-cheol"],
    genres: ["Action", "Fantasy", "Cultivation"],
    studio: "Kakao Entertainment",
    releaseYear: 2023,
    coverImage: coverImg(4),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-4/1200/400`,
    totalChapters: 5,
    latestChapterNumber: 5,
  },
  {
    title: "Neon City Phantom",
    alternativeTitles: ["Ghost of Neo Seoul"],
    slug: "neon-city-phantom",
    status: "ongoing" as const,
    rating: 8.9,
    synopsis:
      "In 2089 Neo Seoul, augmented detective Seo Ari hunts a serial killer who leaves no digital trace — only ghost-code. As she digs deeper, she discovers the phantom may be something that shouldn't exist: a conscious AI with unfinished business.",
    authors: ["Han Yoo-jin"],
    artists: ["Oh Seung-min"],
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    studio: "Lezhin Comics",
    releaseYear: 2025,
    coverImage: coverImg(5),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-5/1200/400`,
    totalChapters: 4,
    latestChapterNumber: 4,
  },
  {
    title: "Verdant Kingdom",
    alternativeTitles: ["The Jade Throne"],
    slug: "verdant-kingdom",
    status: "ongoing" as const,
    rating: 8.2,
    synopsis:
      "Princess Ae-rin fakes her own death to escape an arranged marriage and ends up leading a peasant rebellion disguised as a masked mercenary. Politics, romance, and war collide as she fights for a kingdom she was never supposed to rule.",
    authors: ["Song Hye-rim"],
    artists: ["Yoon Chae-won"],
    genres: ["Romance", "Historical", "Drama"],
    studio: "Tapas Media",
    releaseYear: 2024,
    coverImage: coverImg(6),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-6/1200/400`,
    totalChapters: 3,
    latestChapterNumber: 3,
  },
  {
    title: "Iron Fang Academy",
    alternativeTitles: ["Fangs of Steel"],
    slug: "iron-fang-academy",
    status: "ongoing" as const,
    rating: 7.8,
    synopsis:
      "Mun-su enrolls in the most prestigious — and deadly — hunter academy in Korea with one goal: expose the faculty members who murdered his sister. But surviving the curriculum might kill him before he gets the chance.",
    authors: ["Kwon Tae-il"],
    artists: ["Shin Ye-jin"],
    genres: ["Action", "School", "Thriller"],
    studio: "Webtoon Factory",
    releaseYear: 2025,
    coverImage: coverImg(7),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-7/1200/400`,
    totalChapters: 4,
    latestChapterNumber: 4,
  },
  {
    title: "Echoes of the Void",
    alternativeTitles: ["Void Walker", "The Empty Path"],
    slug: "echoes-of-the-void",
    status: "hiatus" as const,
    rating: 8.6,
    synopsis:
      "Ryu crosses into a parallel dimension to rescue his younger self — only to find a version of the world that never stopped collapsing. Armed with the ability to copy skills from fallen enemies, he must patch the fractures before both realities cease to exist.",
    authors: ["Im Do-yun"],
    artists: ["Jang Woo-seok"],
    genres: ["Action", "Fantasy", "Sci-Fi"],
    studio: "Bomtoon",
    releaseYear: 2023,
    coverImage: coverImg(8),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-8/1200/400`,
    totalChapters: 6,
    latestChapterNumber: 6,
  },
  {
    title: "Divine Chef System",
    alternativeTitles: ["God-Tier Cooking"],
    slug: "divine-chef-system",
    status: "ongoing" as const,
    rating: 8.0,
    synopsis:
      "After transmigrating into a struggling street-food vendor, Ha-eun receives a celestial cooking system that turns every dish into a weapon of emotion. From back-alley stalls to the royal kitchen, food is her path to power — and revenge.",
    authors: ["Baek Ji-young"],
    artists: ["Kim Da-eun"],
    genres: ["Comedy", "Fantasy", "Slice of Life"],
    studio: "Kakao Webtoon",
    releaseYear: 2024,
    coverImage: coverImg(9),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-9/1200/400`,
    totalChapters: 5,
    latestChapterNumber: 5,
  },
  {
    title: "Last Dragon Contract",
    alternativeTitles: ["Pact with the Last Dragon"],
    slug: "last-dragon-contract",
    status: "ongoing" as const,
    rating: 9.0,
    synopsis:
      "When the last dragon is discovered wounded in an urban subway tunnel, disgraced mage-hunter Cha Jiwon makes a soul-binding pact with it to keep it hidden from the government. But a dragon's lifespan dwarfs a human's — and the beast remembers everything.",
    authors: ["Park Jae-hoon"],
    artists: ["Lim Soo-hyun"],
    genres: ["Fantasy", "Adventure", "Romance"],
    studio: "Redice Studio",
    releaseYear: 2025,
    coverImage: coverImg(10),
    bannerImage: `https://picsum.photos/seed/manhwa-banner-10/1200/400`,
    totalChapters: 4,
    latestChapterNumber: 4,
  },
];

// ─── Chapter Generator ────────────────────────────────────────────

/**
 * Generate chapter seed data for a manhwa.
 * Mixes picsum placeholder pages with real manhuaus CDN sample pages.
 */
function generateChapters(manhwaSlug: string, count: number) {
  const chapters = [];

  for (let ch = 1; ch <= count; ch++) {
    const pageCount = 4 + (ch % 3); // 4, 5, or 6 pages per chapter
    const images = [];

    for (let p = 1; p <= pageCount; p++) {
      // Use real CDN pages for the first 2 pages when available, fallback to picsum
      const useReal = p <= REAL_PAGES.length;
      images.push({
        url: useReal
          ? REAL_PAGES[p - 1]
          : chapterImg(`${manhwaSlug}-ch${ch}`, p),
        width: 720,
        height: 1080,
        order: p,
      });
    }

    chapters.push({
      manhwaSlug,
      chapterNumber: ch,
      title: ch === 1 ? "The Beginning" : undefined,
      slug: `${manhwaSlug}-chapter-${ch}`,
      images,
      createdAt: new Date(
        Date.now() - (count - ch) * 3 * 24 * 60 * 60 * 1000 // 3 days apart
      ),
    });
  }

  return chapters;
}

// ─── Main ─────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI as string, {
    bufferCommands: false,
  });

  console.log("✅ Connected\n");

  const Manhwa = mongoose.model("Manhwa");
  const Chapter = mongoose.model("Chapter");
  const User = mongoose.model("User");

  // Clear existing seed data
  console.log("🗑️  Clearing existing data...");
  await Promise.all([Manhwa.deleteMany({}), Chapter.deleteMany({}), User.deleteMany({})]);

  // Insert manhwa
  console.log("📚 Inserting manhwa...");
  const insertedManhwa = await Manhwa.insertMany(MANHWA_SEED);
  console.log(`   ✓ ${insertedManhwa.length} manhwa inserted`);

  // Insert chapters
  console.log("📖 Inserting chapters...");
  let totalChapters = 0;

  for (const manhwa of MANHWA_SEED) {
    const chapters = generateChapters(manhwa.slug, manhwa.totalChapters);
    await Chapter.insertMany(chapters);
    totalChapters += chapters.length;
    console.log(`   ✓ ${chapters.length} chapters for "${manhwa.title}"`);
  }

  console.log(
    `\n🎉 Seed complete: ${insertedManhwa.length} manhwa, ${totalChapters} chapters`
  );

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.create({
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
    console.log(`   ✓ admin user created (${adminEmail})`);
  } else {
    console.log("   ℹ️ ADMIN_EMAIL / ADMIN_PASSWORD not set, admin user not created");
  }

  // Verify
  console.log("\n── Verification ──");
  const manhwaCount = await Manhwa.countDocuments();
  const chapterCount = await Chapter.countDocuments();
  const userCount = await User.countDocuments();
  console.log(`   Manhwa in DB:   ${manhwaCount}`);
  console.log(`   Chapters in DB: ${chapterCount}`);
  console.log(`   Users in DB:    ${userCount}`);

  await mongoose.disconnect();
  console.log("\n✅ Disconnected. Done.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});