"use client";
import { useState, useEffect, useRef } from "react";
import { Painting } from "../types";
import { GalleryLayout } from "./GalleryLayout"; // Assuming this is the layout for displaying the paintings

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Local input state
  const [submittedTerm, setSubmittedTerm] = useState<string>(""); // Track the submitted search term
  const [paintings, setPaintings] = useState<Painting[] | null>(null); // Paintings data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error state

  const hasFetched = useRef(false); // Ref to prevent fetching on re-renders

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      setSubmittedTerm(searchTerm.trim()); // Set the submitted term and trigger the search
    }
  };

  const fetchPaintingsByWord = async (word: string): Promise<Painting[]> => {
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=https://www.wikiart.org/en/search/${encodeURIComponent(
          word
        )}/1?json=2`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch painting: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data?.[0]) {
        throw new Error(`No paintings found for the word: ${word}`);
      }

      return data;
    } catch (err) {
      throw new Error("Error fetching paintings");
    }
  };

  useEffect(() => {
    if (hasFetched.current || !submittedTerm.trim()) return; // Prevent re-fetching on initial render

    const fetchPaintings = async () => {
      setLoading(true);
      setError(""); // Reset error before fetching

      try {
        const paintingsData = await fetchPaintingsByWord(submittedTerm);
        setPaintings(paintingsData);
      } catch (err) {
        setError("Error fetching paintings");
        setPaintings(null);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchPaintings(); // Fetch paintings when the term is submitted
  }, [submittedTerm]); // Trigger effect when submittedTerm changes

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a painting..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input text-black"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {paintings && paintings.length > 0 ? (
        <>
          <h2 className="results-title">Search Results:</h2>
          <GalleryLayout
            paintings={paintings}
            loading={loading}
            error={error}
          />
        </>
      ) : (
        submittedTerm &&
        !loading &&
        !error && (
          <p className="no-results">No results found for "{submittedTerm}"</p>
        )
      )}
    </div>
  );
};
