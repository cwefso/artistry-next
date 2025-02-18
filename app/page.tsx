import HomeClient from "./components/HomeClient";
import type { Painting } from "./types";

export default async function Home() {
  try {
    const response = await fetch(
      "https://corsproxy.io/?url=http://www.wikiart.org/en/App/Painting/MostViewedPaintings",
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const initialData = await response.json();

    return <HomeClient initialData={initialData as Painting[]} />;
  } catch (error) {
    console.error("Failed to fetch paintings:", error);
    return <HomeClient initialData={[]} />;
  }
}
