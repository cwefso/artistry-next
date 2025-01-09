import { notFound } from "next/navigation"; // For handling 404 cases
import GalleryLayout from "@/app/components/Gallery/GalleryLayout";
import { ArtistPainting } from "@/app/types";
import { use } from "react";
// Function to fetch paintings by artist
async function fetchArtistPaintings(
  artistUrl: string
): Promise<ArtistPainting[]> {
  const url = `http://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl=${artistUrl}&json=2`;

  const response = await fetch(`https://corsproxy.io/?url=${url}`);

  if (!response.ok) {
    throw new Error("Failed to fetch artist information");
  }

  const artistData = await response.json();

  if (!artistData?.length) {
    throw new Error("No paintings found for this artist");
  }

  return artistData;
}

// Server Component
export default function ArtistPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);

  const paintings = use(fetchArtistPaintings(name));
  try {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <GalleryLayout paintings={paintings} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching artist paintings:", error);

    return notFound();
  }
}
