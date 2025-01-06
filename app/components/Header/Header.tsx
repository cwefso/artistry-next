"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    router.push(`/results?q=${encodeURIComponent(trimmedTerm)}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a painting..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full">
      <div className="flex flex-wrap justify-between mx-auto px-8 py-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ArtisTry
            </span>
          </Link>

          {/* Hamburger button */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleMenu}
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <SignedOut>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="py-2 md:py-0">
                <SearchBar />
              </li>
              <li className="px-4 py-2 border border-white bg-black text-white rounded hover:bg-white hover:text-black hover:border-black">
                <SignInButton />
              </li>
            </ul>
          </div>
        </SignedOut>
        <SignedIn>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="py-2 md:py-0 order-3 md:order-1">
                <SearchBar />
              </li>

              <li className="py-2 md:py-0 order-2 md:order-2 flex justify-center items-center">
                <Link
                  href="/my-gallery"
                  className="px-4 py-2 border border-white bg-black text-white rounded hover:bg-white hover:text-black hover:border-black"
                >
                  My Gallery
                </Link>
              </li>

              <li className="hidden md:flex py-2 md:py-0 order-1 md:order-3 flex justify-center items-center">
                <UserButton />
              </li>
            </ul>
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
