import GalleryLayout from "./components/Gallery/GalleryLayout";
import { Painting } from "./types";

// Fisher-Yates shuffle algorithm to shuffle the array
const shuffleArray = (array: Painting[]) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default async function Home() {
  const apiUrl = `${process.env.API_URL}/api/userGallery`;
  console.log("API Request URL:", apiUrl);
  const url =
    "https://corsproxy.io/?url=http://www.wikiart.org/en/App/Painting/MostViewedPaintings";

  let paintings: Painting[] | null = [];
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    paintings = await response.json();
    paintings = shuffleArray(paintings as Painting[]);
  } catch (error) {
    console.error("Failed to fetch paintings:", error);
    paintings = []; // Fallback to an empty array
  }

  return <GalleryLayout paintings={paintings} />;
}
