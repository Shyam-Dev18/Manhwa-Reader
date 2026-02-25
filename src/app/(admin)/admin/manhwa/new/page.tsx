import { BackButton, ManhwaForm } from "@/components/admin";

export default function NewManhwaPage() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-100">Add New Manhwa</h1>
        <BackButton fallbackHref="/admin/manhwa" />
      </div>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <ManhwaForm mode="create" />
      </div>
    </section>
  );
}
