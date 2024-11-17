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
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa", "1024life", "next-game"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#333333" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/pixel-game-icon-tr 192x192.png" },
    { rel: "icon", url: "/pixel-game-icon-tr 192x192.png" },
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
