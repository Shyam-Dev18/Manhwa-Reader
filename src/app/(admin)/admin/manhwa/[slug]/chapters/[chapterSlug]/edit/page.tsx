import { notFound } from "next/navigation";

import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import { BackButton, ChapterForm } from "@/components/admin";

interface EditChapterPageProps {
  params: Promise<{ slug: string; chapterSlug: string }>;
}

export default async function EditChapterPage({ params }: EditChapterPageProps) {
  const { slug, chapterSlug } = await params;

  await dbConnect();

  const chapter = await Chapter.findOne({ manhwaSlug: slug, slug: chapterSlug })
    .select({ chapterNumber: 1, title: 1, slug: 1, images: 1, _id: 0 })
    .lean<
      | {
          chapterNumber: number;
          title?: string;
          slug: string;
          images: { url: string; width: number; height: number; order: number }[];
        }
      | null
    >();

  if (!chapter) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-100">Edit Chapter</h1>
        <BackButton fallbackHref={`/admin/manhwa/${slug}/chapters`} />
      </div>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <ChapterForm
          mode="edit"
          manhwaSlug={slug}
          currentChapterSlug={chapterSlug}
          initialValues={{
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            slug: chapter.slug,
            images: chapter.images,
          }}
        />
      </div>
    </section>
  );
}
