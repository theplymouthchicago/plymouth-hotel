import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Plymouth Chicago | 2, 3 & 4 Bedroom Suites in the Loop",
    template: "%s | The Plymouth Chicago",
  },
  description:
    "Boutique hotel-style apartments in Chicago's Loop. 2, 3, and 4-bedroom units with full kitchens, private bedrooms, and smart check-in. Perfect for groups, families, and extended stays.",
  keywords: [
    "Chicago hotel",
    "boutique hotel Chicago",
    "extended stay Chicago",
    "group hotel Chicago",
    "Loop Chicago hotel",
    "Plymouth Hotel",
    "Chicago suites",
    "multi-bedroom hotel",
    "apartment hotel Chicago",
    "2 bedroom suite Chicago",
    "3 bedroom suite Chicago",
    "4 bedroom suite Chicago",
  ],
  openGraph: {
    title: "The Plymouth Chicago | 2, 3 & 4 Bedroom Suites in the Loop",
    description:
      "Boutique hotel-style apartments in Chicago's Loop. 2, 3, and 4-bedroom units with full kitchens, private bedrooms, and smart check-in. Perfect for groups, families, and extended stays.",
    type: "website",
    locale: "en_US",
    siteName: "The Plymouth Chicago",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Plymouth Chicago | 2, 3 & 4 Bedroom Suites in the Loop",
    description:
      "Boutique hotel-style apartments in Chicago's Loop. 2, 3, and 4-bedroom units with full kitchens, private bedrooms, and smart check-in. Perfect for groups, families, and extended stays.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
