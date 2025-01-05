import { useState, useEffect } from "react";
import { Painting } from "../types";
import { PaintingCard } from "./PaintingCard";

interface GalleryLayoutProps {
  paintings: Painting[] | null;
}

export function GalleryLayout({ paintings }: GalleryLayoutProps) {
  const [validPaintings, setValidPaintings] = useState<Painting[]>([]);

  const isImageValid = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  const sanitizeTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    const validatePaintings = async () => {
      if (!paintings) return;

      const validatedPaintings = await Promise.all(
        paintings.map(async (painting: Painting) => {
          const isValid = await isImageValid(painting.image as string);
          return { painting, isValid };
        })
      );

      const uniquePaintings = Array.from(
        new Map(
          validatedPaintings
            .filter(({ isValid }) => isValid)
            .map(({ painting }) => [painting.contentId, painting])
        ).values()
      );

      setValidPaintings(uniquePaintings);
    };

    validatePaintings();
  }, [paintings]);

  return (
    <main>
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
    </main>
  );
}
