import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Painting, PaintingInformation } from "../types";

const useDeletePainting = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const createClerkSupabaseClient = async () => {
    const clerkToken = await session?.getToken({ template: "supabase" });
    return createClient(
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
  };

  const deleteMutation = useMutation({
    mutationFn: async (painting: PaintingInformation | Painting) => {
      const client = await createClerkSupabaseClient();

      const { error } = await client
        .from("paintings")
        .delete()
        .eq("content_id", painting.contentId)
        .eq("user_id", session?.user.id);

      if (error) throw new Error(error.message || "Failed to delete painting");
      return painting.contentId;
    },
    onMutate: async (deletedPainting) => {
      // Cancel current queries for the paintings list
      await queryClient.cancelQueries({ queryKey: ["userGallery"] });

      // Optimistically update the UI
      const previousPaintings = queryClient.getQueryData<Painting[]>([
        "userGallery",
      ]);

      queryClient.setQueryData<Painting[]>(
        ["userGallery"],
        (old) =>
          old?.filter((p) => p.contentId !== deletedPainting.contentId) || []
      );

      return { previousPaintings };
    },
    onError: (error, _, context) => {
      // Rollback optimistic update
      queryClient.setQueryData(["userGallery"], context?.previousPaintings);
      throw error; // Let error boundaries handle this
    },
    onSettled: () => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["userGallery"] });
      queryClient.invalidateQueries({ queryKey: ["paintings"] });
    },
  });

  return {
    deleteStatus: {
      isLoading: deleteMutation.isPending,
      error: deleteMutation.error?.message || null,
      success: deleteMutation.isSuccess,
    },
    deletePainting: deleteMutation.mutate,
    reset: deleteMutation.reset,
  };
};

export default useDeletePainting;
