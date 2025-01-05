"use client";
import { useState, useEffect, useRef } from "react";
import { Painting } from "../types";

const useSearch = (word: string) => {
  const [paintings, setPaintings] = useState<Painting[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(""); // Error state is defined
  const hasFetched = useRef(false);

  const fetchPaintingsByWord = async (word: string): Promise<Painting[]> => {
    const response = await fetch(
      `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${encodeURIComponent(word)}/1?json=2`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch painting: ${response.statusText}`);
    }

    const paintings = await response.json();
    
    if (!paintings?.[0]) {
      throw new Error(`No painting found for word: ${word}`);
    }

    return paintings;
  };

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchRandomWordAndPainting = async () => {
      setLoading(true);

      try {
        const paintingData = await fetchPaintingsByWord(word);
        setPaintings(paintingData);
      } catch (error) {
        console.error("Error details:", error);
        setError("Error fetching painting");
        setPaintings(null);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchRandomWordAndPainting();
  }, [word]); // Dependency on `word` to refetch when it changes

  return { paintings, loading, error }; // Return the error so you can use it in the component
};

export default useSearch;
