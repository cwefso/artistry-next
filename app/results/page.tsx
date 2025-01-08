import { Suspense, use } from "react";
import GalleryLayout from "../components/Gallery/GalleryLayout";
import type { Painting } from "../types";

// Fetch function for paintings
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

// Promise for paintings (used with `use`)
const getPaintingsPromise = (searchQuery: string) =>
  fetchPaintings(searchQuery);

interface PaintingsContentProps {
  searchQuery: string;
}

function PaintingsContent({ searchQuery }: PaintingsContentProps) {
  // Use the `use` API to read the data and suspend rendering until it's resolved.
  const paintings = use(getPaintingsPromise(searchQuery));

  if (!paintings.length) {
    return <p className="p-4 text-gray-500">No results found</p>;
  }

  return <GalleryLayout paintings={paintings} />;
}

interface ResultsPageProps {
  searchParams?: { q?: string };
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  const searchQuery = searchParams?.q;

  if (!searchQuery) {
    return <div className="p-4">Please provide a search query.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <PaintingsContent searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
