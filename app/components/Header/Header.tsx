"use client";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { SearchBar } from "./Search";
import Link from "next/link";

const Header = () => {
  const { isSignedIn } = useAuth();

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
        </div>

        <div className={`w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col justify-center items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {/* Search bar - always visible */}
            <li className="py-2 md:py-0 ">
              <SearchBar />
            </li>

            {/* Conditional buttons */}
            {isSignedIn ? (
              <>
                <li className="py-2 md:py-0 flex justify-center items-center">
                  <Link
                    href="/my-gallery"
                    className="px-4 py-2 border border-white bg-black text-white rounded hover:bg-white hover:text-black hover:border-black"
                  >
                    My Gallery
                  </Link>
                </li>
                <li className="hidden md:flex py-2 md:py-0 flex justify-center items-center">
                  <UserButton />
                </li>
              </>
            ) : (
              <li className="px-4 py-2 w-[30%] md:w-auto text-center border border-white bg-black text-white rounded hover:bg-white hover:text-black hover:border-black">
                <SignInButton mode="modal" />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
