"use client";

interface SiteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SiteError({ error, reset }: SiteErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-red-400 sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        We couldn&apos;t load this page right now. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-1 text-xs text-gray-500">Error ID: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        Retry
      </button>
    </div>
  );
}
