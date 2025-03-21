import { Providers } from "./providers";
import "./globals.css";
import Header from "./components/Header/Header";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArtisTry",
  description: "An app to find and collect art.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Providers>
          <Header />
          <section className="m-4 ">{children}</section>
        </Providers>
      </body>
    </html>
  );
}
