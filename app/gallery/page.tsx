// pages/gallery/page.tsx
"use client";

import { GalleryLayout } from "../components/GalleryLayout";
import usePaintings from "../hooks/usePaintings";

export default function Gallery() {
  const { paintings, loading, error } = usePaintings(
    "http://www.wikiart.org/en/App/Painting/MostViewedPaintings"
  );

  return (
    <GalleryLayout paintings={paintings} loading={loading} error={error} />
  );
}
