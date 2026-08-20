"use client";

// ============================================================
// DIGIVER
// ExploreSearchBar
// ============================================================

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Search, X } from "lucide-react";

import { useExplore } from "@/hooks/useExplore";

const MAX_SEARCH_QUERY_LENGTH = 100;

export interface ExploreSearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  debounceMs?: number;
  className?: string;
}

export function ExploreSearchBar({
  placeholder = "Search personas, circles, and posts...",
  autoFocus = false,
  debounceMs = 400,
  className,
}: ExploreSearchBarProps) {
  const { query, search } = useExplore();

  const [value, setValue] = useState(() =>
    query.slice(0, MAX_SEARCH_QUERY_LENGTH),
  );

  const inputId = useId();

  /*
   * Prevent an outdated debounced callback from triggering
   * another search after the user has already changed the value.
   */
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  /*
   * Keep the local input synchronized only when the external
   * query actually changes independently of this input.
   *
   * No setState is performed synchronously inside the effect.
   */
  useEffect(() => {
    const normalizedQuery = query
      .normalize("NFKC")
      .slice(0, MAX_SEARCH_QUERY_LENGTH);

    if (normalizedQuery === latestValueRef.current) {
      return;
    }

    setValue(normalizedQuery);
  }, [query]);

  /*
   * Keep the latest search callback available without making
   * the debounce effect restart whenever ExploreProvider
   * recreates the search callback due to filter changes.
   *
   * This prevents filter changes from scheduling a duplicate
   * debounced search for the current input value.
   */
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  /*
   * Debounced automatic search.
   *
   * IMPORTANT:
   * Empty input is intentionally searched too.
   *
   * This clears old search results when the user deletes
   * everything from the search bar.
   */
  useEffect(() => {
    const normalizedValue = value
      .normalize("NFKC")
      .trim()
      .slice(0, MAX_SEARCH_QUERY_LENGTH);

    const timer = window.setTimeout(() => {
      /*
       * Do not execute a stale timer.
       */
      if (latestValueRef.current !== value) {
        return;
      }

      void searchRef.current(normalizedValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, debounceMs]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value.slice(
        0,
        MAX_SEARCH_QUERY_LENGTH,
      );

      latestValueRef.current = nextValue;
      setValue(nextValue);
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedValue = value
        .normalize("NFKC")
        .trim()
        .slice(0, MAX_SEARCH_QUERY_LENGTH);

      void searchRef.current(normalizedValue);
    },
    [value],
  );

  const handleClear = useCallback(() => {
    latestValueRef.current = "";

    setValue("");

    /*
     * Explicitly clear the search immediately.
     *
     * The provider is responsible for invalidating any
     * previous in-flight request.
     */
    void searchRef.current("");
  }, []);

  return (
    <form
      role="search"
      aria-label="Explore search"
      onSubmit={handleSubmit}
      className={[
        "relative w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        Search personas, circles, and posts
      </label>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />

        <input
          id={inputId}
          type="search"
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          maxLength={MAX_SEARCH_QUERY_LENGTH}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        )}
      </div>
    </form>
  );
}