"use client";

import Image from "next/image";
import useRandomPainting from "./hooks/useRandomPainting";
import { useCallback, useEffect, useState } from "react";
import { Painting } from "./types";

interface PaintingDetailsProps {
  painting: Painting;
  onRefresh: () => void;
  onSave: () => Promise<void>;
}

const PaintingDetails = ({
  painting,
  onRefresh,
  onSave,
}: PaintingDetailsProps) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <div className="text-center w-full flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-2">{painting.title}</h2>
      <p className="text-lg mb-4">{painting.artistName}</p>
      <div className="relative mb-4">
        <Image
          src={painting.image as string}
          alt={painting.title as string}
          width={painting.width}
          height={painting.height}
          className="rounded-md shadow-lg"
          priority
        />
      </div>
      <p className="text-sm text-gray-500">Year: {painting.yearAsString}</p>
    </div>
    <div className="flex gap-4 mt-4">
      <button
        onClick={onRefresh}
        className="border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors"
      >
        Get Another Painting
      </button>
      <button
        onClick={onSave}
        className="border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors"
      >
        Save Painting to Gallery
      </button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
);

export default function Home() {
  const [loadedPainting, setLoadedPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { painting } = useRandomPainting();

  useEffect(() => {
    if (painting && loading) {
      setLoadedPainting(painting);
      setLoading(false);
      setError(null);
    }
  }, [painting, loading]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const saveMetadata = useCallback(async () => {
    if (!loadedPainting) return;

    try {
      const response = await fetch("/api/saveMetadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadataValue: loadedPainting,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save metadata");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    }
  }, [loadedPainting]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="border border-red-500 text-red-500 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loadedPainting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">No painting found</p>
          <button
            onClick={handleRefresh}
            className="border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PaintingDetails
      painting={loadedPainting}
      onRefresh={handleRefresh}
      onSave={saveMetadata}
    />
  );
}
