"use client";
import { useState, useCallback } from "react";
import type { Painting } from "../types";
import { GalleryLayout } from "./GalleryLayout";

interface SearchState {
  paintings: Painting[] | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: SearchState = {
  paintings: null,
  isLoading: false,
  error: null,
};

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [{ paintings, isLoading, error }, setSearchState] =
    useState<SearchState>(INITIAL_STATE);

  const fetchPaintingsByWord = useCallback(
    async (word: string): Promise<Painting[]> => {
      const endpoint = `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${encodeURIComponent(
        word
      )}/1?json=2`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch paintings: ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || !data.length) {
        throw new Error(`No paintings found for: ${word}`);
      }

      return data;
    },
    []
  );

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    setSearchState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const paintingsData = await fetchPaintingsByWord(trimmedTerm);
      setSearchState({
        paintings: paintingsData,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setSearchState({
        paintings: null,
        isLoading: false,
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a painting..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 text-black rounded border"
          aria-label="Search paintings"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div role="alert" className="text-red-500">
          {error}
        </div>
      )}

      {paintings?.length ? (
        <section aria-label="Search Results">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <GalleryLayout paintings={paintings} />
        </section>
      ) : (
        searchTerm &&
        !isLoading &&
        !error && (
          <p className="text-gray-500">No results found for "{searchTerm}"</p>
        )
      )}
    </div>
  );
};
