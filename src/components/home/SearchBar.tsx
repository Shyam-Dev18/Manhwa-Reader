"use client";

import { useCallback, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const lastPushedRef = useRef(initialQuery.trim());

  const navigateToQuery = useCallback(
    (nextQuery: string) => {
      if (nextQuery === lastPushedRef.current) {
        return;
      }

      startTransition(() => {
        if (nextQuery) {
          router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
        } else {
          router.push("/search");
        }
      });

      lastPushedRef.current = nextQuery;
    },
    [router, startTransition]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = query.trim();
      navigateToQuery(trimmed);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, navigateToQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    navigateToQuery(query.trim());
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="sr-only">
        Search manhwa
      </label>
      <div className="flex items-center gap-2">
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, alt title, or genre..."
          className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
        <Button
          type="submit"
          variant="secondary"
          className="h-11 min-w-24"
          disabled={isPending}
        >
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
