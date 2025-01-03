"use client";

import Image from "next/image";
import useRandomPainting from "../hooks/useRandomPainting";

export default function Home() {
  const { painting, loading } = useRandomPainting();

  if (loading || !painting) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <h1>Loading...</h1>
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">{painting.title}</h2>
        <p className="text-lg mb-4">{painting.artistName}</p>
        <Image
          src={painting.image as string}
          alt={painting.title as string}
          width={600}
          height={400}
          className="rounded-md shadow-lg mb-4"
        />
        <p className="text-sm text-gray-500">
          Year: {painting.completitionYear}
        </p>
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
