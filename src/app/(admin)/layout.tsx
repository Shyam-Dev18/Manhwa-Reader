import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { AdminSidebar } from "@/components/admin";
import { Logo } from "@/components/layout";
import { LogoutButton } from "@/components/auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-gray-800 bg-gray-950/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo href="/admin" animate={false} />
              <div>
                <h1 className="text-base font-semibold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">Manage catalog and chapters</p>
              </div>
            </div>
            <nav className="flex items-center gap-3 text-sm">
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-violet-300">
                {session.user.role}
              </span>
              <Link href="/" className="text-gray-300 transition-colors hover:text-white">
                View Site
              </Link>
              <Link href="/admin/manhwa" className="text-gray-300 transition-colors hover:text-white">
                Manhwa
              </Link>
              <LogoutButton className="h-9 rounded-md bg-gray-800 px-3 text-sm text-gray-100 hover:bg-gray-700" />
            </nav>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
