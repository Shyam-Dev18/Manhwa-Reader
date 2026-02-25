import { BackButton, ChapterForm } from "@/components/admin";

interface NewChapterPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewChapterPage({ params }: NewChapterPageProps) {
  const { slug } = await params;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-100">Add Chapter</h1>
        <BackButton fallbackHref={`/admin/manhwa/${slug}/chapters`} />
      </div>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <ChapterForm mode="create" manhwaSlug={slug} />
      </div>
    </section>
  );
}
