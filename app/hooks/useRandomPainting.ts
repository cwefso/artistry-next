"use client";
import { useState, useEffect, useRef } from "react";
import { Painting } from "../types";

interface FetchWordResponse {
  word: string;
}

const useRandomPainting = () => {
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(false);
  const [bannedWords, setBannedWords] = useState<Set<string>>(new Set());
  const hasFetched = useRef(false);

  const fetchRandomWord = async (): Promise<string> => {
    const response = await fetch("/api/randomWord", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Banned-Words": JSON.stringify(Array.from(bannedWords)),
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
  };

  const fetchPaintingByWord = async (word: string): Promise<Painting> => {
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

    return paintings[0];
  };

  const getValidWord = async (): Promise<string> => {
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (attempts < MAX_ATTEMPTS) {
      const word = await fetchRandomWord();
      
      if (!bannedWords.has(word)) {
        return word;
      }
      
      attempts++;
      console.log(`Word "${word}" is banned, attempt ${attempts}/${MAX_ATTEMPTS}`);
    }

    throw new Error(`Failed to find valid word after ${MAX_ATTEMPTS} attempts`);
  };

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchRandomWordAndPainting = async () => {
      setLoading(true);

      try {
        const word = await getValidWord();
        setBannedWords(prev => new Set(prev).add(word));
        
        const paintingData = await fetchPaintingByWord(word);
        setPainting(paintingData);
      } catch (error) {
        console.error("Error fetching painting:", error instanceof Error ? error.message : "Unknown error");
        setPainting(null);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchRandomWordAndPainting();
  }, []);

  return { painting, loading };
};

export default useRandomPainting;