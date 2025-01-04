"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Painting } from "../types";

export default function MyGallery() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/userGallery");
        if (!response.ok) {
          throw new Error("Failed to fetch gallery");
        }
        const data = await response.json();
        setPaintings(data.gallery);

        // Validate all images and filter out invalid ones
        const validatedPaintings = await Promise.all(
          data.gallery.map(async (painting: Painting) => {
            const isValid = await isImageValid(painting.image as string);
            return { painting, isValid };
          })
        );

        setValidPaintings(
          validatedPaintings
            .filter(({ isValid }) => isValid)
            .map(({ painting }) => painting)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Sanitize title for URL
  const sanitizeTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

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
      ) : validPaintings.length === 0 ? (
        <p className="text-center mt-6 text-lg">
          Your gallery is empty. Start adding paintings to see them here!
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
