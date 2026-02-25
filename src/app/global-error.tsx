"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-red-400 sm:text-4xl">
            Unexpected Error
          </h1>
          <p className="mt-3 max-w-md text-sm text-gray-400 sm:text-base">
            Something went wrong while rendering this page.
          </p>
          <p className="mt-1 text-xs text-gray-500">{error.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
