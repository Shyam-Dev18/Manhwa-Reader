import { notFound } from "next/navigation";
import Link from "next/link";

import { getAdminManhwaBySlug } from "@/lib/fetchers";
import { BackButton, ManhwaForm } from "@/components/admin";
import { Button } from "@/components/ui";

interface EditManhwaPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditManhwaPage({ params }: EditManhwaPageProps) {
  const { slug } = await params;
  const manhwa = await getAdminManhwaBySlug(slug);

  if (!manhwa) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-100">Edit Manhwa</h1>
        <div className="flex gap-2">
          <BackButton fallbackHref="/admin/manhwa" />
          <Link href={`/admin/manhwa/${slug}/chapters`}>
            <Button variant="secondary">Manage Chapters</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <ManhwaForm
          mode="edit"
          currentSlug={slug}
          initialValues={{
            title: manhwa.title,
            slug: manhwa.slug,
            coverImage: manhwa.coverImage,
            synopsis: manhwa.synopsis,
            genres: manhwa.genres,
            rating: manhwa.rating,
            publicationStatus: manhwa.publicationStatus ?? "published",
            status: manhwa.status,
          }}
        />
      </div>
    </section>
  );
}
