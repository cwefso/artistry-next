"use client";
import { useArtistPaintings } from "../../hooks/useArtistInfo";
import { usePathname } from "next/navigation"; // Correct import
import { GalleryLayout } from "@/app/components/GalleryLayout";

export default function ArtistPage() {
  const pathname = usePathname();
  const artistAsString = pathname.split("/").filter(Boolean).pop();
  const { paintings, isLoading, error } = useArtistPaintings(
    artistAsString as string
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">
          Loading artist information...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {paintings && <div></div>}
      <GalleryLayout paintings={paintings} />
    </div>
  );
}
