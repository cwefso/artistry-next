"use client";

import { Painting } from "../../types";
import { PaintingCard } from "./PaintingCard";
import { useEffect, useState } from "react";

interface GalleryLayoutProps {
  paintings: Painting[];
}

const isImageValid = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

const sanitizeTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

async function validatePaintings(paintings: Painting[]): Promise<Painting[]> {
  const validatedPaintings = await Promise.all(
    paintings.map(async (painting) => {
      const isValid = await isImageValid(painting.image as string);
      return { painting, isValid };
    })
  );

  return Array.from(
    new Map(
      validatedPaintings
        .filter(({ isValid }) => isValid)
        .map(({ painting }) => [painting.contentId, painting])
    ).values()
  );
}

export default function GalleryLayout({ paintings }: GalleryLayoutProps) {
  const [validPaintings, setValidPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaintings = async () => {
      const validatedPaintings = await validatePaintings(paintings);
      setValidPaintings(validatedPaintings);
      setLoading(false); // Set loading to false once the images are validated
    };

    loadPaintings();
  }, [paintings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner">Loading images...</div>{" "}
        {/* You can replace this with a loading spinner */}
      </div>
    );
  }

  if (!validPaintings.length) {
    return <div>No valid paintings found.</div>;
  }

  return (
    <main>
      <section className="gallery" aria-label="gallery">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 auto-rows-auto">
          {validPaintings.map((painting: Painting) => (
            <PaintingCard
              key={painting.contentId}
              painting={painting}
              sanitizeTitle={sanitizeTitle}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
