import { Providers } from "./providers";
import "./globals.css";
import Header from "./components/Header/Header";
import Head from "next/head";

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
