import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";
import { buildMetadata } from "@/utils/seo";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Admin login page.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/admin";

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-gray-100">Admin Login</h1>
      <p className="mt-1 text-sm text-gray-400">
        Sign in with your credentials to access the admin area.
      </p>

      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
