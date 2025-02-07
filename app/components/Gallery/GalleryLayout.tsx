"use client";

import { Painting } from "../../types";
import { PaintingCard } from "./PaintingCard";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

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
  const [savedPaintingIds, setSavedPaintingIds] = useState<Set<string>>(
    new Set()
  );
  const { userId, getToken } = useAuth();

  // Fetch saved paintings directly from Supabase
  useEffect(() => {
    const fetchSavedPaintings = async () => {
      if (!userId) return;

      try {
        // Get Clerk token for Supabase
        const clerkToken = await getToken({ template: "supabase" });

        // Create authenticated Supabase client
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${clerkToken}`,
              },
            },
          }
        );

        // Fetch user's saved paintings
        const { data: savedPaintings, error } = await supabase
          .from("paintings")
          .select("content_id")
          .eq("user_id", userId);

        if (!error && savedPaintings) {
          const savedIds = new Set(savedPaintings.map((p) => p.content_id));
          setSavedPaintingIds(savedIds);
        }
      } catch (error) {
        console.error("Error fetching saved paintings:", error);
      }
    };

    fetchSavedPaintings();
  }, [userId, getToken]);

  // Validate paintings
  useEffect(() => {
    const loadPaintings = async () => {
      try {
        const validatedPaintings = await validatePaintings(paintings);
        setValidPaintings(validatedPaintings);
      } catch (error) {
        console.error("Error validating paintings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPaintings();
  }, [paintings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!validPaintings.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No valid paintings found.
      </div>
    );
  }

  return (
    <main>
      <section className="gallery" aria-label="gallery">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 auto-rows-auto">
          {validPaintings.map((painting) => (
            <PaintingCard
              key={painting.contentId}
              painting={painting}
              sanitizeTitle={sanitizeTitle}
              isSaved={
                savedPaintingIds
                  ? savedPaintingIds.has(painting.contentId as string)
                  : false
              }
            />
          ))}
        </div>
      </section>
    </main>
  );
}
