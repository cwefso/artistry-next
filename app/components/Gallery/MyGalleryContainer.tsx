"use client";

import useGetPaintings from "@/app/hooks/useGetPaintings";
import GalleryLayout from "./GalleryLayout";
import LoadingSpinner from "../LoadingSpinner";

export const MyGalleryContainer = () => {
  const { data: paintings, isLoading } = useGetPaintings();

  if (isLoading) return <LoadingSpinner />;
  if (!isLoading && paintings) {
    return (
      <div>
        <GalleryLayout paintings={paintings} />
      </div>
    );
  }
};
