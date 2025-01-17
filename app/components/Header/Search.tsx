"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export const SearchBar = () => {
  const searchTerm = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTerm = searchTerm.current?.value.trim();
    if (!trimmedTerm) return;

    router.push(`/results?q=${encodeURIComponent(trimmedTerm)}`);
    if (searchTerm.current) {
      searchTerm.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a painting..."
          ref={searchTerm}
          className="flex-1 px-4 py-2 text-black rounded border"
          aria-label="Search paintings"
        />
        <button
          type="submit"
          className="px-4 py-2 border border-white bg-black text-white rounded hover:bg-white hover:text-black hover:border-black"
        >
          Search
        </button>
      </div>
    </form>
  );
};
