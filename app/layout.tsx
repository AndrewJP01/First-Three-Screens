import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CraveSave | Compare food deals",
  description: "Search by craving and compare nearby restaurant deals in one place.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
