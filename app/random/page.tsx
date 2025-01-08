import GalleryLayout from "../components/Gallery/GalleryLayout";
import randomTerms from "../randomTerms";
import { Painting } from "../types";

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
  const randomIndex = Math.floor(Math.random() * randomTerms.length);
  const word = randomTerms[randomIndex];
  try {
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
