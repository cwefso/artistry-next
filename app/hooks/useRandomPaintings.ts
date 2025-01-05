"use client";
import { useState, useEffect, useRef } from "react";
import { Painting } from "../types";

interface FetchWordResponse {
  word: string;
}

const useRandomPaintings = () => {
  const [paintings, setPaintings] = useState<Painting[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const hasFetched = useRef<boolean>(false);

  // Function to fetch random word from the API
  const fetchRandomWord = async (): Promise<string> => {
    try {
      const response = await fetch("/api/randomWord", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch random word: ${response.statusText}`);
      }

      const { word } = (await response.json()) as FetchWordResponse;

      if (!word) {
        throw new Error("No word received from API");
      }

      return word;
    } catch (error) {
      console.error(error)
      throw new Error("Error fetching random word");
    }
  };

  // Function to fetch paintings based on a word
  const fetchPaintingsByWord = async (word: string): Promise<Painting[]> => {
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${encodeURIComponent(
          word
        )}/1?json=2`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch painting: ${response.statusText}`);
      }

      const paintings = await response.json();
      
      if (!paintings?.[0]) {
        throw new Error(`No painting found for word: ${word}`);
      }

      return paintings;
    } catch (error) {
      console.error(error)
      throw new Error("Error fetching paintings");
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchRandomWordAndPainting = async () => {
      setLoading(true);

      try {
        const word = await fetchRandomWord();
        const paintingData = await fetchPaintingsByWord(word);
        setPaintings(paintingData);
      } catch (err) {
        // TypeScript will infer the type as `unknown`, so we need to type it
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        setPaintings(null);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchRandomWordAndPainting();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return { paintings, loading, error };
};

export default useRandomPaintings;
