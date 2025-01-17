import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <section className="m-4 ">{children}</section>
        </body>
      </html>
    </ClerkProvider>
  );
}
