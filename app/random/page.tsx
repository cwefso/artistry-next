import GalleryLayout from "../components/Gallery/GalleryLayout";
import { Painting } from "../types";

// Function to fetch a random word
async function fetchRandomWord(): Promise<string> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/randomWord`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch random word: ${response.statusText}`);
  }

  const { word } = (await response.json()) as { word: string };

  if (!word) {
    throw new Error("No word received from API");
  }

  return word;
}

// Function to fetch paintings based on a word
async function fetchPaintingsByWord(word: string): Promise<Painting[]> {
  const response = await fetch(
    `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${encodeURIComponent(
      word
    )}/1?json=2`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch paintings: ${response.statusText}`);
  }

  const paintings = await response.json();

  if (!paintings?.[0]) {
    throw new Error(`No painting found for word: ${word}`);
  }

  return paintings;
}

// Server Component
export default async function Home() {
  try {
    const word = await fetchRandomWord();
    const paintings = await fetchPaintingsByWord(word);

    return <GalleryLayout paintings={paintings} />;
  } catch (error) {
    console.error("Error fetching paintings:", error);

    return (
      <section className="flex items-center justify-center min-h-screen">
        <h1>Failed to load paintings. Please try again later.</h1>
      </section>
    );
  }
}
