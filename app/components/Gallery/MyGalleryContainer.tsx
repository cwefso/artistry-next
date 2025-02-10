"use client";

import useGetPaintings from "@/app/hooks/useGetPaintings";
import GalleryLayout from "./GalleryLayout";

export const MyGalleryContainer = () => {
  const { paintings } = useGetPaintings();

  return (
    <div>
      <GalleryLayout paintings={paintings} />
    </div>
  );
};
