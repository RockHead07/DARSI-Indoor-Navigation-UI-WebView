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
    <html lang="id" className="h-full overflow-hidden antialiased">
      {/* html/body themselves never scroll — Android's WebView draws its own native
          fading scrollbar indicator for document-level scroll, which CSS scrollbar-hide
          rules (globals.css) can't suppress. Scrolling happens in the inner div below
          instead, where the same CSS rules DO reliably hide it. */}
      <body className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto">{children}</div>
        <ArSessionResume />
      </body>
    </html>
  );
}
