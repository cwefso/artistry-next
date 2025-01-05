"use client";

import { GalleryLayout } from "./components/Gallery/GalleryLayout";
import usePaintings from "./hooks/usePaintings";

export default function Home() {
  const { paintings } = usePaintings(
    "http://www.wikiart.org/en/App/Painting/MostViewedPaintings"
  );

  return <GalleryLayout paintings={paintings} />;
}
