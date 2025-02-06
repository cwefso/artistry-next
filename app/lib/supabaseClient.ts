import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rntkgmywnobayfzfandi.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY!;

// Base client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get authenticated client with JWT
export const getAuthenticatedClient = async (userId: string) => {
  try {
    // Fetch the token from the API
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_CLERK_DOMAIN}/v1/users/${userId}/oauth_access_tokens/supabase`
    );

    // Log the raw response for debugging
    const rawResponse = await response.text();
    console.log("Raw Response:", rawResponse);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Clean the response (remove BOM, trim whitespace, etc.)
    const cleanedResponse = rawResponse.trim().replace(/^\uFEFF/, "");

    // Parse the cleaned response as JSON
    const { token } = JSON.parse(cleanedResponse);

    // Return the authenticated Supabase client
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get authenticated client:", error);
    throw new Error("Failed to authenticate with Supabase");
  }
};
