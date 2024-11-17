import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Provider";
import LoadingState from "@/components/LoadingState";
import Check from "@/components/Check";

export const metadata: Metadata = {
  title: "1024Life",
  description: "A 1024 mind game",
  authors: [
    { name: "Mrinmoy Mondal", url: "https://github.com/mrinmoymondalreal" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Check>
          <Providers>
            <LoadingState />
          </Providers>
          {children}
        </Check>
      </body>
    </html>
  );
}
