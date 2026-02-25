import Link from "next/link";
import { Button } from "@/components/ui";

export default async function AdminPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-100">Admin Dashboard</h1>
      <p className="text-sm text-gray-400">
        Manage manhwa content and metadata from this panel.
      </p>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/manhwa">
            <Button variant="secondary">View Manhwa Table</Button>
          </Link>
          <Link href="/admin/manhwa/new">
            <Button>Add New Manhwa</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
