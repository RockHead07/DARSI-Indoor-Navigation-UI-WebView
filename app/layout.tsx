import type { Metadata } from "next";
import "./globals.css";
import ArSessionResume from "./ArSessionResume";

// ponytail: font-family stack (Roboto-preferred + system fallback) via CSS instead of
// next/font/google — avoids a build/dev-time network fetch of the font (fails offline)
// and keeps the app working without an external CDN dependency. --font-roboto is in globals.css.

export const metadata: Metadata = {
  title: "Darsi Indoor Navigation",
  description: "Indoor navigation webview for Darsi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ArSessionResume />
      </body>
    </html>
  );
}
