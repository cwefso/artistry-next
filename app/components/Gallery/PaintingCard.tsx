"use client";

import Link from "next/link";
import Image from "next/image";
import { Painting } from "../../types";

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
        <Image
          src={painting.image as string}
          alt={`Artwork: ${painting.title}`}
          height={painting.height}
          width={painting.width}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
