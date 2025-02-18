import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Painting, PaintingInformation } from "../types";

const useSavePainting = () => {
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

  const saveMutation = useMutation({
    mutationFn: async (painting: PaintingInformation | Painting) => {
      const client = await createClerkSupabaseClient();

      const { data, error } = await client.from("paintings").insert([
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
      ]);

      if (error) throw new Error(error.message || "Failed to save painting");
      return data?.[0] as unknown as Painting;
    },
    onMutate: async (newPainting) => {
      await queryClient.cancelQueries({ queryKey: ["userGallery"] });

      const previousPaintings = queryClient.getQueryData<Painting[]>([
        "userGallery",
      ]);
      const optimisticPainting = {
        ...newPainting,
        // Add temporary ID if needed
        contentId: `temp-${Date.now()}`,
      };

      queryClient.setQueryData<Painting[]>(["userGallery"], (old) =>
        old ? [...old, optimisticPainting] : [optimisticPainting]
      );

      return { previousPaintings };
    },
    onSuccess: (savedPainting) => {
      // Replace optimistic painting with real data
      queryClient.setQueryData<Painting[]>(["userGallery"], (old) =>
        old?.map((p) => (p.contentId?.startsWith("temp-") ? savedPainting : p))
      );
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["userGallery"], context?.previousPaintings);
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userGallery"] });
      queryClient.invalidateQueries({ queryKey: ["paintings"] });
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
