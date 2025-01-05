import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
  const buttonClass =
    "border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors";

  return (
    <section>
      <SignedOut>
        <div className="flex flex-row justify-between items-center m-4">
          <Link href="/gallery" className={buttonClass}>
            Gallery
          </Link>
          <Link href="/search" className={buttonClass}>
            Search
          </Link>
          <div className={buttonClass}>
            <SignInButton />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-row justify-between items-center m-4">
          <Link href="/my-gallery" className={buttonClass}>
            My Gallery
          </Link>
          <Link href="/gallery" className={buttonClass}>
            Gallery
          </Link>
          <Link href="/search" className={buttonClass}>
            Search
          </Link>
          <UserButton />
        </div>
      </SignedIn>
    </section>
  );
};

export default Header;
