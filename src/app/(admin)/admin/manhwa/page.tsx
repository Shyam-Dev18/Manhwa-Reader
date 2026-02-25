import Link from "next/link";

import { getAdminManhwaList } from "@/lib/fetchers";
import { ManhwaTable } from "@/components/admin";
import { Button } from "@/components/ui";

interface AdminManhwaPageProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function AdminManhwaPage({ searchParams }: AdminManhwaPageProps) {
  const { page } = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(page || "1", 10) || 1);

  const { data, pagination } = await getAdminManhwaList(pageNumber, PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-100">Manhwa</h1>
        <Link href="/admin/manhwa/new">
          <Button>Add New</Button>
        </Link>
      </div>

      <ManhwaTable items={data} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Page {pagination.page} of {Math.max(1, pagination.totalPages)}
        </p>

        <div className="flex gap-2">
          <Link href={`/admin/manhwa?page=${Math.max(1, pagination.page - 1)}`}>
            <Button variant="outline" size="sm" disabled={pagination.page <= 1}>
              Prev
            </Button>
          </Link>
          <Link href={`/admin/manhwa?page=${pagination.page + 1}`}>
            <Button variant="outline" size="sm" disabled={!pagination.hasNextPage}>
              Next
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
