// app/HomeClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import GalleryLayout from "./Gallery/GalleryLayout";
import type { Painting } from "../types";

const shuffleArray = (array: Painting[]) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default function HomeClient({
  initialData,
}: {
  initialData: Painting[];
}) {
  const { data } = useQuery({
    queryKey: ["mostViewedPaintings"],
    queryFn: async () => {
      const response = await fetch(
        "https://corsproxy.io/?url=http://www.wikiart.org/en/App/Painting/MostViewedPaintings",
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Failed to fetch paintings");
      return response.json();
    },
    initialData: shuffleArray(initialData),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return <GalleryLayout paintings={data} />;
}
