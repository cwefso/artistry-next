import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Painting, PaintingInformation } from "../types";

interface SaveStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const INITIAL_SAVE_STATUS: SaveStatus = {
  isLoading: false,
  error: null,
  success: false,
};

const useSavePainting = () => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(INITIAL_SAVE_STATUS);
  const { session } = useSession();

  // Create a custom Supabase client with Clerk token injection
  const createClerkSupabaseClient = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            const headers = new Headers(options?.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  };

  const savePainting = async (
    painting: PaintingInformation | Painting,
    onSaveSuccess?: () => void,
    onSaveError?: (error: string) => void
  ) => {
    setSaveStatus({ ...INITIAL_SAVE_STATUS, isLoading: true });

    try {
      // Create an authenticated Supabase client
      const client = createClerkSupabaseClient();

      // Insert the painting into the "paintings" table
      const { error } = await client.from("paintings").insert([
        {
          content_id: painting.contentId,
          title: painting.title,
          image_url: painting.image,
          artist_name: painting.artistName,
          artist_content_id: painting.artistContentId,
          completion_year: painting.completitionYear,
          year_as_string: painting.yearAsString,
          height: painting.height,
          width: painting.width,
          user_id: session?.user.id, // Associate the painting with the current user
        },
      ]);

      if (error) {
        throw new Error(error.message || "Failed to save painting");
      }

      setSaveStatus({ isLoading: false, error: null, success: true });
      onSaveSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSaveStatus({
        isLoading: false,
        error: errorMessage,
        success: false,
      });
      onSaveError?.(errorMessage);
    }
  };

  return { saveStatus, savePainting };
};

export default useSavePainting;
