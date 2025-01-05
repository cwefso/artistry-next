import { useState, useEffect } from "react";
import { Painting } from "../types";

const usePaintings = (initialUrl: string) => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [url, setUrl] = useState<string>(initialUrl);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("false");

  // Fisher-Yates shuffle algorithm to shuffle the array
  const shuffleArray = (array: Painting[]): Painting[] => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    setError("false");
    setLoading(true);

    const loadPaintings = async () => {
      try {
        const response = await fetch(`https://corsproxy.io/?url=${url}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Define the result as an array of Painting objects
        const result: Painting[] = await response.json();
        const shuffled = shuffleArray(result);
        setPaintings(shuffled);
      } catch (err) {
        // Option 1: Log the error (for debugging purposes)
        console.error(err);

        // Option 2: If you don't want to log, just set the error state
        setError("true");
      } finally {
        setLoading(false);
      }
    };

    loadPaintings();
  }, [url]);

  return {
    paintings,
    setUrl,
    loading,
    error,
  };
};

export default usePaintings;
