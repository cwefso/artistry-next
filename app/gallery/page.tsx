"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Painting } from "../types";
import usePaintings from "../hooks/usePaintings";

export default function Gallery() {
  const { paintings, loading, error } = usePaintings(
    "http://www.wikiart.org/en/App/Painting/MostViewedPaintings"
  );

  const [validPaintings, setValidPaintings] = useState<Painting[]>([]);

  const handleImageError = (paintingId: string) => {
    setValidPaintings((prev) =>
      prev.filter((painting) => painting.contentId !== paintingId)
    );
  };

  // Sanitize title for URL
  const sanitizeTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    setValidPaintings(paintings);
  }, [paintings]);

  return (
    <main>
      <section className="header w-full flex flex-row justify-between">
        <h1 className="page-title">ArtisTry</h1>
        <section className="search">Search</section>
      </section>

      {loading ? (
        <p className="text-center mt-6 text-lg">Loading paintings...</p>
      ) : error ? (
        <p className="text-center mt-6 text-lg text-red-500">
          Error loading paintings. Please try again later.
        </p>
      ) : (
        <section className="gallery" aria-label="gallery">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {validPaintings.map((painting: Painting) => (
              <Link
                key={painting.contentId}
                href={{
                  pathname: `/painting/${sanitizeTitle(
                    painting.title || "untitled"
                  )}`,
                  query: {
                    artistName: painting.artistName,
                    image: painting.image,
                    width: painting.width,
                    height: painting.height,
                  },
                }}
              >
                <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md">
                  <Image
                    src={painting.image as string}
                    alt={painting.title || "Untitled"}
                    width={painting.width || 300}
                    height={painting.height || 300}
                    className="rounded-md shadow-lg"
                    onError={() =>
                      handleImageError(painting.contentId as string)
                    }
                  />
                  <p className="text-center mt-2 text-lg">
                    {painting.title || "Untitled"}
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    {painting.artistName || "Unknown Artist"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
