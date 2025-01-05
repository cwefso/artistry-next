import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="flex flex-row justify-between items-center m-4">
              <div className="border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors">
                <Link href="/my-gallery">My Gallery</Link>
              </div>
              <div className="border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors">
                <Link href="/gallery">Gallery</Link>
              </div>
              <div className="border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors">
                <Link href="/search">Search</Link>
              </div>
              <UserButton />
            </div>
          </SignedIn>
          <section className="m-4">{children}</section>
        </body>
      </html>
    </ClerkProvider>
  );
}
