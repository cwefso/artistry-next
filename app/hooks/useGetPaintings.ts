// app/hooks/useGetPaintings.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser, useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
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

const useGetPaintings = () => {
  const { user } = useUser();
  const { session } = useSession();

  const mapPainting = (row: PaintingRow): Painting => ({
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

  return useQuery({
    queryKey: ["paintings", user?.id],
    queryFn: async () => {
      if (!session || !user) {
        throw new Error("No authenticated user");
      }

      const token = await session.getToken({ template: "supabase" });
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
          global: { headers: { Authorization: `Bearer ${token}` } },
        }
      );

      const { data, error } = await supabase
        .from("paintings")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    select: (data) => (data || []).map(mapPainting),
    enabled: !!session && !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export default useGetPaintings;
