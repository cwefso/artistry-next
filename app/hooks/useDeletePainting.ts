import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Painting, PaintingInformation } from "../types";

interface DeleteStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const INITIAL_DELETE_STATUS: DeleteStatus = {
  isLoading: false,
  error: null,
  success: false,
};

const useDeletePainting = () => {
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>(
    INITIAL_DELETE_STATUS
  );
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

  const deletePainting = async (
    painting: PaintingInformation | Painting,
    onDeleteSuccess?: () => void,
    onDeleteError?: (error: string) => void
  ) => {
    setDeleteStatus({ ...INITIAL_DELETE_STATUS, isLoading: true });

    try {
      // Create an authenticated Supabase client
      const client = createClerkSupabaseClient();

      // Delete the painting from the "paintings" table
      const { error } = await client
        .from("paintings")
        .delete()
        .eq("content_id", painting.contentId)
        .eq("user_id", session?.user.id);

      if (error) {
        throw new Error(error.message || "Failed to delete painting");
      }

      setDeleteStatus({ isLoading: false, error: null, success: true });
      onDeleteSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setDeleteStatus({
        isLoading: false,
        error: errorMessage,
        success: false,
      });
      onDeleteError?.(errorMessage);
    }
  };

  return { deleteStatus, deletePainting };
};

export default useDeletePainting;
