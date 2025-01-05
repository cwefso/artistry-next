// components/GalleryLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { Painting } from "../types";
import { PaintingCard } from "./PaintingCard";

interface GalleryLayoutProps {
  paintings: Painting[] | null;
  loading: boolean;
  error: string | null;
}

export function GalleryLayout({
  paintings,
  loading,
  error,
}: GalleryLayoutProps) {
  const [validPaintings, setValidPaintings] = useState<Painting[]>([]);

  // Function to check if an image URL is valid
  const isImageValid = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Sanitize title for URL
  const sanitizeTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    const validatePaintings = async () => {
      if (!paintings) return;

      // Validate all images and filter out invalid ones
      const validatedPaintings = await Promise.all(
        paintings.map(async (painting: Painting) => {
          const isValid = await isImageValid(painting.image as string);
          return { painting, isValid };
        })
      );

      setValidPaintings(
        validatedPaintings
          .filter(({ isValid }) => isValid)
          .map(({ painting }) => painting)
      );
    };

    validatePaintings();
  }, [paintings]);

  return (
    <main>
      {loading ? (
        <p className="text-center mt-6 text-lg">Loading paintings...</p>
      ) : error ? (
        <p className="text-center mt-6 text-lg text-red-500">
          Error loading paintings. Please try again later.
        </p>
      ) : validPaintings.length === 0 ? (
        <p className="text-center mt-6 text-lg">
          No paintings available. Please try again later.
        </p>
      ) : (
        <section className="gallery" aria-label="gallery">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {validPaintings.map((painting: Painting) => (
              <PaintingCard
                key={painting.contentId}
                painting={painting}
                sanitizeTitle={sanitizeTitle}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
