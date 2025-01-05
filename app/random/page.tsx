"use client";

import useRandomPaintings from "../hooks/useRandomPaintings";
import { GalleryLayout } from "../components/GalleryLayout";

export default function Home() {
  const { paintings, loading } = useRandomPaintings();

  if (loading || !paintings) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <h1>Loading...</h1>
      </section>
    );
  }

  return <GalleryLayout paintings={paintings} />;
}
