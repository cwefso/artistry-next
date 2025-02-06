import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Painting } from "../types";
import GalleryLayout from "../components/Gallery/GalleryLayout";

export default async function MyGallery() {
  const { sessionId, userId } = await auth();

  if (!sessionId) {
    return <div>Unauthorized</div>;
  }

  try {
    const client = await clerkClient();
    const { jwt: clerkToken } = (await client.sessions.getToken(
      sessionId,
      "supabase"
    )) as { jwt: string };

    console.log("Clerk Token:", clerkToken);
    console.log("Session ID:", sessionId);
    console.log("User ID from Clerk:", userId);

    if (!clerkToken) {
      throw new Error("Failed to retrieve authentication token.");
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${clerkToken}` } },
    });

    const { data: paintings, error } = await supabase
      .from("paintings")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      return <div>Error loading gallery.</div>;
    }

    console.log("paintings", paintings);

    const gallery: Painting[] =
      paintings?.map((row) => ({
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
    console.error(error);
    return <div>Error loading gallery.</div>;
  }
}
