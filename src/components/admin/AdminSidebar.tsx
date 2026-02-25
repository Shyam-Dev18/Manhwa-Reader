import Link from "next/link";
import { Logo } from "@/components/layout";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/manhwa", label: "Manhwa" },
  { href: "/admin/manhwa/new", label: "Add New" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full border-b border-gray-800 bg-gray-950 p-4 md:w-64 md:border-b-0 md:border-r md:p-5">
      <div className="space-y-2">
        <Logo href="/admin" animate={false} />
        <h2 className="text-sm font-medium text-gray-400">Admin Panel</h2>
      </div>
      <nav className="mt-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
