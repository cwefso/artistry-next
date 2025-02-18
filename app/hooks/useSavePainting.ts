import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Painting, PaintingInformation } from "../types";

const useSavePainting = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const createClerkSupabaseClient = async () => {
    if (!session) {
      throw new Error("Session not available");
    }

    const clerkToken = await session.getToken({ template: "supabase" });
    if (!clerkToken) {
      throw new Error("Failed to get authentication token");
    }

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

  const saveMutation = useMutation({
    mutationFn: async (painting: PaintingInformation | Painting) => {
      // Validate painting object
      if (!painting || !painting.contentId) {
        throw new Error("Invalid painting data: contentId is missing");
      }

      const client = await createClerkSupabaseClient();

      const { data, error } = await client
        .from("paintings")
        .insert([
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
            user_id: session?.user.id,
          },
        ])
        .select() // Add this to return the inserted row
        .single(); // Ensure a single row is returned

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to save painting");
      }

      if (!data) {
        throw new Error("No data returned from Supabase");
      }

      return data[0] as Painting;
    },
    onMutate: async (newPainting) => {
      // Validate newPainting before proceeding
      if (!newPainting || !newPainting.contentId) {
        throw new Error("Invalid painting data for optimistic update");
      }

      await queryClient.cancelQueries({ queryKey: ["userGallery"] });

      const previousPaintings = queryClient.getQueryData<Painting[]>([
        "userGallery",
      ]);

      queryClient.setQueryData<Painting[]>(["userGallery"], (old = []) => {
        const optimisticPainting: Painting = {
          ...newPainting,
          contentId: `${newPainting.contentId}-temp`, // Use temp ID
          isOptimistic: true,
        };

        return [...old, optimisticPainting];
      });

      return { previousPaintings };
    },
    onSuccess: (savedPainting) => {
      // Replace optimistic painting with real data
      queryClient.setQueryData<Painting[]>(["userGallery"], (old) =>
        old?.map((p) =>
          p.contentId === `${savedPainting?.contentId}-temp` ? savedPainting : p
        )
      );
    },
    onError: (error, painting, context) => {
      console.error("Save painting error:", error);
      if (context?.previousPaintings) {
        queryClient.setQueryData(["userGallery"], context.previousPaintings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userGallery"] });
    },
  });

  return {
    saveStatus: {
      isLoading: saveMutation.isPending,
      error: saveMutation.error?.message || null,
      success: saveMutation.isSuccess,
    },
    savePainting: saveMutation.mutate,
    reset: saveMutation.reset,
  };
};

export default useSavePainting;
