import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Painting } from "../types";
import GalleryLayout from "../components/Gallery/GalleryLayout";

type PaintingRow = {
  content_id: string;
  title: string;
  image_url: string;
  artist_name: string;
  artist_content_id: string;
  completion_year: number;
  year_as_string: string;
  height: number;
  width: number;
  user_id: string; // Assuming this exists in your table
};

export default async function MyGallery() {
  const { sessionId, userId } = await auth();

  if (!sessionId) {
    return <div>Unauthorized</div>;
  }

  try {
    // Fetch the Clerk token for Supabase authentication
    const client = await clerkClient();
    const { jwt: clerkToken } = (await client.sessions.getToken(
      sessionId,
      "supabase"
    )) as { jwt: string };

    if (!clerkToken) {
      throw new Error("Failed to retrieve authentication token.");
    }

    // Create a custom Supabase client with Clerk token injection
    const createClerkSupabaseClient = () => {
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
          global: {
            fetch: async (url, options = {}) => {
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

    // Initialize Supabase client
    const supabase = createClerkSupabaseClient();

    // Fetch paintings for the current user
    const { data: paintings, error } = await supabase
      .from("paintings")
      .select("*")
      .eq("user_id", userId.toString());

    if (error) {
      console.error("Supabase error:", error);
      return <div>Error loading gallery.</div>;
    }

    // Map the fetched rows to the Painting type
    const gallery: Painting[] =
      paintings?.map((row: PaintingRow) => ({
        contentId: row.content_id,
        title: row.title,
        image: row.image_url,
        artistName: row.artist_name,
        artistContentId: row.artist_content_id,
        completitionYear: row.completion_year,
        yearAsString: row.year_as_string,
        height: row.height,
        width: row.width,
      })) || [];

    return <GalleryLayout paintings={gallery} />;
  } catch (error) {
    console.error("Error fetching paintings:", error);
    return <div>Error loading gallery.</div>;
  }
}
