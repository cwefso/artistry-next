"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GalleryLayout } from "../components/Gallery/GalleryLayout";
import type { Painting } from "../types";

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const [paintings, setPaintings] = useState<Painting[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaintings = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      setError(null);

      try {
        const endpoint = `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${encodeURIComponent(
          searchQuery
        )}/1?json=2`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch paintings: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error(`No paintings found for: ${searchQuery}`);
        }

        setPaintings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaintings();
  }, [searchQuery]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{searchQuery}&quot;
      </h1>

      {paintings?.length ? (
        <GalleryLayout paintings={paintings} />
      ) : (
        <p className="text-gray-500">No results found</p>
      )}
    </div>
  );
};

export default ResultsPage;
