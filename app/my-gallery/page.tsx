"use client";

import { useState, useEffect } from "react";
import { Painting } from "../types";
import { GalleryLayout } from "../components/GalleryLayout";

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
        <GalleryLayout paintings={paintings} loading={loading} error={error} />
      )}
    </main>
  );
}
