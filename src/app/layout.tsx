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

const BASE_URL = "https://www.theplymouthchicago.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Plymouth Chicago | 2, 3 & 4-Bedroom Suites in the Loop",
    template: "%s | The Plymouth Chicago",
  },
  description:
    "The Plymouth Chicago offers spacious 2, 3, and 4-bedroom boutique suites in Chicago's Printer's Row. Full kitchens, private bedrooms, and smart check-in — perfect for groups, families, and extended stays in the Loop.",
  keywords: [
    "boutique hotel Chicago",
    "hotel Chicago Loop",
    "hotel alternative Chicago",
    "Chicago Loop hotel alternative",
    "Printers Row apartments Chicago",
    "apartment hotel Chicago",
    "furnished suites Chicago",
    "extended stay Chicago",
    "extended stay Chicago Loop",
    "2 bedroom suite Chicago",
    "3 bedroom suite Chicago",
    "4 bedroom suite Chicago",
    "group hotel Chicago",
    "group accommodation Chicago",
    "family hotel Chicago",
    "Chicago South Loop hotel",
    "vacation rental Chicago Loop",
    "private bedroom hotel Chicago",
    "Chicago apartment for groups",
    "Chicago suite hotel",
    "Plymouth Hotel Chicago",
    "short term rental Chicago Loop",
    "multi bedroom hotel Chicago",
  ],
  openGraph: {
    title: "The Plymouth Chicago | 2, 3 & 4-Bedroom Suites in the Loop",
    description:
      "Spacious boutique suites in Chicago's Printer's Row. 2, 3, and 4-bedroom units with full kitchens, private bedrooms, and smart check-in. Perfect for groups, families, and extended stays.",
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "The Plymouth Chicago",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Plymouth Chicago — Boutique Suites in the Loop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Plymouth Chicago | 2, 3 & 4-Bedroom Suites in the Loop",
    description:
      "Spacious boutique suites in Chicago's Printer's Row. Full kitchens, private bedrooms, smart check-in.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
  },
};

const hotelSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hotel",
      "@id": `${BASE_URL}/#hotel`,
      name: "The Plymouth Chicago",
      url: BASE_URL,
      description:
        "The Plymouth Chicago is a boutique apartment-hotel in Chicago's Printer's Row offering 2, 3, and 4-bedroom suites with full kitchens, private bedrooms, and modern amenities — ideal for groups, families, and extended stays.",
      telephone: "+17088660029",
      email: "info@theplymouthchicago.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "417 S Dearborn St",
        addressLocality: "Chicago",
        addressRegion: "IL",
        postalCode: "60605",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 41.8773,
        longitude: -87.6292,
      },
      priceRange: "$$$",
      currenciesAccepted: "USD",
      paymentAccepted: "Credit Card",
      checkinTime: "15:00",
      checkoutTime: "11:00",
      numberOfRooms: 19,
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Full Kitchen", value: true },
        { "@type": "LocationFeatureSpecification", name: "High-Speed WiFi", value: true },
        { "@type": "LocationFeatureSpecification", name: "Private Bedrooms", value: true },
        { "@type": "LocationFeatureSpecification", name: "Smart Self Check-In", value: true },
        { "@type": "LocationFeatureSpecification", name: "Washer & Dryer", value: true },
        { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
        { "@type": "LocationFeatureSpecification", name: "Pet Friendly", value: false },
      ],
      hasMap: "https://maps.google.com/?q=417+S+Dearborn+St+Chicago+IL+60605",
      image: `${BASE_URL}/images/living-dark.jpg`,
      logo: `${BASE_URL}/images/plymouth-logo.png`,
      containsPlace: [
        {
          "@type": "Accommodation",
          name: "2-Bedroom Suite",
          description: "Spacious 2-bedroom suite accommodating up to 4 guests with full kitchen.",
          occupancy: { "@type": "QuantitativeValue", maxValue: 4 },
          numberOfBedrooms: 2,
          numberOfBathroomsTotal: 1,
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Full Kitchen", value: true },
            { "@type": "LocationFeatureSpecification", name: "Living Room", value: true },
          ],
        },
        {
          "@type": "Accommodation",
          name: "3-Bedroom Suite",
          description: "Generous 3-bedroom suite accommodating up to 6 guests with full kitchen.",
          occupancy: { "@type": "QuantitativeValue", maxValue: 6 },
          numberOfBedrooms: 3,
          numberOfBathroomsTotal: 2,
        },
        {
          "@type": "Accommodation",
          name: "4-Bedroom Suite",
          description: "Premium 4-bedroom suite accommodating up to 10 guests — ideal for large groups.",
          occupancy: { "@type": "QuantitativeValue", maxValue: 10 },
          numberOfBedrooms: 4,
          numberOfBathroomsTotal: 2,
        },
      ],
      nearbyAttractions: [
        { "@type": "TouristAttraction", name: "Millennium Park", url: "https://www.chicago.gov/city/en/depts/dca/supp_info/millennium_park.html" },
        { "@type": "TouristAttraction", name: "The Art Institute of Chicago" },
        { "@type": "TouristAttraction", name: "Navy Pier" },
        { "@type": "TouristAttraction", name: "United Center" },
      ],
      sameAs: [
        "https://www.airbnb.com/users/show/theplymouthchicago",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "The Plymouth Chicago",
      description: "Boutique apartment-hotel in Chicago's Printer's Row",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
