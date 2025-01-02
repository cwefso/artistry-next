"use client";

import Image from "next/image";
import usePainting from "./hooks/usePainting"; // Adjust the import to your file structure
import { useEffect, useState } from "react";
import RandomWordPage from "./components/RandomWordPage";

export default function Home() {

  const [loadedPainting, setLoadedPainting] = useState()
  const [word, setWord] = useState("null");
  const [loading, setLoading] = useState(false);

  const { painting } = usePainting(
    `https://www.wikiart.org/en/search/${word}/1?json=2`
  );
  
  useEffect(()=> {
    if(painting && word){
      console.log(painting)
      setLoadedPainting(painting)
    }
  },[painting, word])

  useEffect(()=> {
    setWord(fetchRandomWord())
  },[])

  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/randomWord");
      const data = await response.json();
      setWord(data.word);
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("Error fetching word");
    } finally {
      setLoading(false);
    }
  };

  if(loadedPainting) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">{loadedPainting.title}</h2>
        <p className="text-lg mb-4">{loadedPainting.artistName}</p>
        <Image
          src={loadedPainting.image}
          alt={loadedPainting.title}
          width={loadedPainting.width}
          height={loadedPainting.height}
          className="rounded-md shadow-lg mb-4"
          />
        <p className="text-sm text-gray-500">Year: {loadedPainting.yearAsString}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 border border-white text-white py-2 px-4 rounded-md"
        >
        Get Another Painting
      </button>
    </div>
  );
  }
}
