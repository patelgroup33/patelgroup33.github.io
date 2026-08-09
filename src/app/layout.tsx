import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://patelgroup33.github.io"),
  title: "Dev Patel Portfolio",
  description:
    "AI & Software Engineer — a cinematic, scroll-driven portfolio.",
  authors: [{ name: "Dev Patel" }],
  openGraph: {
    title: "Dev Patel Portfolio",
    description: "AI & Software Engineer — a cinematic, scroll-driven portfolio.",
    siteName: "Dev Patel Portfolio",
    url: "https://patelgroup33.github.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Patel Portfolio",
    description: "AI & Software Engineer — a cinematic, scroll-driven portfolio.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${space.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
