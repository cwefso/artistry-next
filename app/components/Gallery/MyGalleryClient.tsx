"use client";

import { useState, useEffect } from "react";
import { Painting } from "@/app/types";
import GalleryLayout from "./GalleryLayout";

interface MyGalleryClientProps {
  paintings: Painting[];
}

export function MyGalleryClient({ paintings }: MyGalleryClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paintings.length > 0) {
      setLoading(false); // If we already have paintings, we're no longer loading
    }
  }, [paintings]);

  return (
    <main>
      <section className="header w-full flex flex-row justify-between">
        <h1 className="page-title">My Gallery</h1>
      </section>

      {loading ? (
        <p className="text-center mt-6 text-lg">Loading your gallery...</p>
      ) : error ? (
        <p className="text-center mt-6 text-lg text-red-500">
          Error loading your gallery: {error}
        </p>
      ) : paintings.length === 0 ? (
        <p className="text-center mt-6 text-lg">
          Your gallery is empty. Start adding paintings to see them here!
        </p>
      ) : (
        <></>
        // <GalleryLayout paintings={paintings} />
      )}
    </main>
  );
}
