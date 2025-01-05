"use client";

import Link from "next/link";
import { Painting } from "../types";

interface PaintingCardProps {
  painting: Painting;
  sanitizeTitle: (title: string) => string;
}

export function PaintingCard({ painting, sanitizeTitle }: PaintingCardProps) {
  return (
    <Link
      href={`/painting/${sanitizeTitle(painting.title as string)}?contentId=${
        painting.contentId
      }`}
      className="block"
    >
      <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md">
        <img
          src={painting.image as string}
          alt={painting.title || "Untitled"}
          className="rounded-md shadow-lg w-full h-auto"
        />
        <p className="text-center mt-2 text-lg">
          {painting.title || "Untitled"}
        </p>
        <p className="text-center text-sm text-gray-500">
          {painting.artistName || "Unknown Artist"}
        </p>
      </div>
    </Link>
  );
}
