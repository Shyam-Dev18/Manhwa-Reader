import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-violet-500">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-200">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm 
                   font-medium text-white transition-colors hover:bg-violet-500"
      >
        Back to Home
      </Link>
    </div>
  );
}
