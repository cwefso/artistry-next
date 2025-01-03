"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useState, useEffect } from "react";
import { Painting } from "../types";

const useRandomPainting = () => {
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRandomWordAndPainting = async () => {
      setLoading(true);
      try {
        // Fetch random word
        const wordResponse = await fetch("/api/randomWord");
        const { word } = await wordResponse.json();

        // Fetch painting
        const paintingResponse = await fetch(
          `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${word}/1?json=2`
        );
        const paintingResult = await paintingResponse.json();
        setPainting(paintingResult[0]); // Adjust based on API response
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error:", err.message);
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRandomWordAndPainting();
  }, []);

  return { painting, loading };
};

export default useRandomPainting;
