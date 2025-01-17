import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/Header/Header";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Header />
          <section className="m-4 ">{children}</section>
        </body>
      </html>
    </ClerkProvider>
  );
}
