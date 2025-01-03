"use client";
import { useState, useEffect, useRef } from "react";
import { Painting } from "../types";

const useRandomPainting = () => {
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(false);
  const [bannedWords, setBannedWords] = useState<string[]>([]); // Track banned words
  const hasFetched = useRef(false); // Track if fetch has already completed

  useEffect(() => {
    if (hasFetched.current) return; // Prevent re-running the effect after the first fetch

    const fetchRandomWordAndPainting = async () => {
      setLoading(true);
      try {
        let word = "";
        let retry = true;

        while (retry) {
          // Fetch random word and ensure it is not banned
          const wordResponse = await fetch("/api/randomWord", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Banned-Words": JSON.stringify(bannedWords), // Send banned words to the API
            },
          });
          const { word: fetchedWord } = await wordResponse.json();

          if (fetchedWord && !bannedWords.includes(fetchedWord)) {
            word = fetchedWord;
            retry = false; // Exit loop if valid word is found
          } else {
            // If word is in the banned list, try again
            console.log(`Word ${fetchedWord} is banned, retrying...`);
          }
        }

        // Add the valid word to the banned list
        setBannedWords((prevWords) => [...prevWords, word]);

        // Fetch painting related to the random word
        const paintingResponse = await fetch(
          `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${word}/1?json=2`
        );
        const paintingResult = await paintingResponse.json();

        if (paintingResult[0]) {
          setPainting(paintingResult[0]); // Set the painting to state
        } else {
          console.error("No painting found for the word.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error:", err.message);
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark the fetch as completed
      }
    };

    fetchRandomWordAndPainting();
  }, []); // Empty dependency array to run the effect only once

  return { painting, loading };
};

export default useRandomPainting;
