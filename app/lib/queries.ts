// lib/queries.ts
"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useArtist = (artistId: string) => {
  return useQuery({
    queryKey: ["artist", artistId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/artists/${artistId}`);
      return res.json();
    },
    enabled: !!artistId,
  });
};

export const usePainting = (artistId: string, paintingId: string) => {
  return useQuery({
    queryKey: ["painting", artistId, paintingId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/artists/${artistId}/paintings/${paintingId}`
      );
      return res.json();
    },
    enabled: !!artistId && !!paintingId,
  });
};
