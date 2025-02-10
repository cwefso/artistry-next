import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser, useSession } from "@clerk/nextjs";
import type { Painting } from "../types";

interface PaintingRow {
  content_id: string;
  title: string;
  image_url: string;
  artist_name: string;
  artist_content_id: string;
  completion_year: number;
  year_as_string: string;
  height: number;
  width: number;
  user_id: string;
}

interface FetchStatus {
  isLoading: boolean;
  error: string | null;
  paintings: Painting[];
}

const INITIAL_FETCH_STATUS: FetchStatus = {
  isLoading: false,
  error: null,
  paintings: [],
};

const useGetPaintings = () => {
  const { user } = useUser();
  const { session } = useSession();
  const [fetchStatus, setFetchStatus] =
    useState<FetchStatus>(INITIAL_FETCH_STATUS);

  const mapPaintingRow = (row: PaintingRow): Painting => ({
    contentId: row.content_id,
    title: row.title,
    image: row.image_url,
    artistName: row.artist_name,
    artistContentId: row.artist_content_id,
    completitionYear: row.completion_year,
    yearAsString: row.year_as_string,
    height: row.height,
    width: row.width,
  });

  const fetchPaintings = useCallback(async () => {
    if (!session || !user) {
      setFetchStatus((prev) => ({
        ...prev,
        error: "No authenticated user",
        isLoading: false,
      }));
      return;
    }

    setFetchStatus((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get Supabase token from Clerk
      const token = await session.getToken({ template: "supabase" });

      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      // Create Supabase client with Clerk token
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );

      // Fetch paintings for the current user
      const { data: paintings, error: supabaseError } = await supabase
        .from("paintings")
        .select("*")
        .eq("user_id", user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      const mappedPaintings = (paintings || []).map(mapPaintingRow);

      setFetchStatus({
        isLoading: false,
        error: null,
        paintings: mappedPaintings,
      });
    } catch (error) {
      console.error("Error fetching paintings:", error);
      setFetchStatus((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch paintings",
      }));
    }
  }, [session, user]);

  useEffect(() => {
    fetchPaintings();
  }, [fetchPaintings]);

  return {
    ...fetchStatus,
    refetch: fetchPaintings,
  };
};

export default useGetPaintings;
