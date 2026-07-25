import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://allowai.africa";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Allow AI Africa — Applied AI, built in Africa",
    template: "%s · Allow AI Africa",
  },
  description:
    "Allow AI Africa builds applied artificial intelligence for African markets — model tooling, sovereign data infrastructure and enterprise AI for banks, telcos, agritech and the public sector.",
  keywords: [
    "AI Africa",
    "African artificial intelligence",
    "machine learning",
    "enterprise AI",
    "African languages NLP",
    "data infrastructure",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Allow AI Africa",
    title: "Allow AI Africa — Applied AI, built in Africa",
    description:
      "Model tooling, sovereign data infrastructure and enterprise AI engineered for African markets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Allow AI Africa — Applied AI, built in Africa",
    description:
      "Model tooling, sovereign data infrastructure and enterprise AI engineered for African markets.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1618",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-page text-ink min-h-full">{children}</body>
    </html>
  );
}
