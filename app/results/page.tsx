"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GalleryLayout } from "../components/Gallery/GalleryLayout";
import type { Painting } from "../types";

const fetchPaintings = async (searchQuery: string): Promise<Painting[]> => {
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

  return data;
};

const PaintingsLoader = ({ searchQuery }: { searchQuery: string }) => {
  const [paintings, setPaintings] = useState<Painting[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPaintings(searchQuery);
        setPaintings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    };

    fetchData();
  }, [searchQuery]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!paintings) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      {paintings.length ? (
        <GalleryLayout paintings={paintings} />
      ) : (
        <p className="text-gray-500">No results found</p>
      )}
    </>
  );
};

const ResultsContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  if (!searchQuery) {
    return <div className="p-4">Please provide a search query.</div>;
  }

  return <PaintingsLoader searchQuery={searchQuery} />;
};

const ResultsPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <ResultsContent />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
