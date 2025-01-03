"use client";

import Image from "next/image";
import useRandomPainting from "./hooks/useRandomPainting";
import { useEffect, useState } from "react";
import { Painting } from "./types";

export default function Home() {
  const [loadedPainting, setLoadedPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { painting } = useRandomPainting();

  useEffect(() => {
    if (painting && loading) {
      setLoadedPainting(painting);
      setLoading(false);
    }
  }, [painting]);

  // Prevent rendering when painting is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  const saveMetadata = async () => {
    const metadataValue = loadedPainting || {}; // Send the entire painting object
    console.log("metadataValue", metadataValue);
    const response = await fetch("/api/saveMetadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadataValue,
      }),
    });

    if (response.ok) {
      console.log("Metadata saved successfully.");
    } else {
      const errorData = await response.json();
      console.error("Failed to save metadata:", errorData.error);
    }
  };

  if (!loading && loadedPainting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2">
            {loadedPainting.title}
          </h2>
          <p className="text-lg mb-4">{loadedPainting.artistName}</p>
          <Image
            src={loadedPainting.image as string}
            alt={loadedPainting.title as string}
            width={loadedPainting.width}
            height={loadedPainting.height}
            className="rounded-md shadow-lg mb-4"
          />
          <p className="text-sm text-gray-500">
            Year: {loadedPainting.yearAsString}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 border border-white text-white py-2 px-4 rounded-md"
        >
          Get Another Painting
        </button>
        <button
          onClick={saveMetadata}
          className="mt-4 border border-white text-white py-2 px-4 rounded-md"
        >
          Save Painting to Gallery
        </button>
      </div>
    );
  }
}
