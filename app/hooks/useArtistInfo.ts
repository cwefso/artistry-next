"use client";
import { useState, useEffect } from 'react';
import { ArtistPainting } from '../types';


interface UseArtistPaintingsResult {
  paintings: ArtistPainting[];
  isLoading: boolean;
  error: string | null;
}

export const useArtistPaintings = (artistUrl: string): UseArtistPaintingsResult => {
  const [paintings, setPaintings] = useState<ArtistPainting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const url = `http://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl=${artistUrl}&json=2`
    const fetchArtistData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch artist info
        const artistResponse = await fetch(`https://corsproxy.io/?url=${url}`);

        if (!artistResponse.ok) {
          throw new Error('Failed to fetch artist information');
        }

        const artistData = await artistResponse.json();
        
        setPaintings(artistData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching artist data');
        console.error('Artist fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (artistUrl) {
      fetchArtistData();
    }
  }, [artistUrl]);

  return { paintings, isLoading, error };
};