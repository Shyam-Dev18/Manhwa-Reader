import Link from "next/link";
import { notFound } from "next/navigation";

import dbConnect from "@/lib/mongodb";
import Manhwa from "@/models/Manhwa";
import Chapter from "@/models/Chapter";
import { ChapterTable } from "@/components/admin";
import { Button } from "@/components/ui";

interface AdminChaptersPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminChaptersPage({ params }: AdminChaptersPageProps) {
  const { slug } = await params;

  await dbConnect();

  const [manhwa, chapters] = await Promise.all([
    Manhwa.findOne({ slug })
      .select({ title: 1, slug: 1, _id: 0 })
      .lean<{ title: string; slug: string } | null>(),
    Chapter.find({ manhwaSlug: slug })
      .sort({ chapterNumber: 1 })
      .select({ chapterNumber: 1, title: 1, slug: 1, images: 1, _id: 0 })
      .lean<
        {
          chapterNumber: number;
          title?: string;
          slug: string;
          images: { url: string; width: number; height: number; order: number }[];
        }[]
      >(),
  ]);

  if (!manhwa) {
    notFound();
  }

  const rows = chapters.map((chapter) => ({
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    slug: chapter.slug,
    imageCount: chapter.images.length,
  }));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Chapter Management</h1>
          <p className="text-sm text-gray-400">{manhwa.title}</p>
        </div>

        <div className="flex gap-2">
          <Link href={`/admin/manhwa/${slug}/edit`}>
            <Button variant="outline">Back</Button>
          </Link>
          <Link href={`/admin/manhwa/${slug}/chapters/new`}>
            <Button>Add Chapter</Button>
          </Link>
        </div>
      </div>

      <ChapterTable manhwaSlug={slug} items={rows} />
    </section>
  );
}
