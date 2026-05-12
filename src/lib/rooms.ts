export interface RoomType {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  listingId: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  idealFor: string;
  image: string;
  alt: string;
}

export const ROOMS: RoomType[] = [
  {
    slug: "2br",
    name: "The Two Bedroom",
    tagline: "More space than a hotel. More style than an Airbnb.",
    description:
      "Two private bedrooms, full kitchen, living room, and city views. Built for couples, small families, or business pairs who refuse to compromise on space or design.",
    listingId: "69b8610659a0a7001528058c",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    features: [
      "2 private bedrooms",
      "Full kitchen with dishwasher",
      "Living & dining area",
      "High-speed WiFi",
      '55" Smart TV',
      "In-unit washer/dryer",
      "Self check-in",
      "Rooftop access",
    ],
    idealFor: "Couples · Small Families · Business Pairs",
    image: "/images/living-green.jpg",
    alt: "Two bedroom suite living room with teal mural and dining table",
  },
  {
    slug: "3br",
    name: "The Three Bedroom",
    tagline: "Bring the whole crew. Nobody has to share a bed.",
    description:
      "Three private bedrooms, two full bathrooms, and an open living space designed for groups who want to be together without being on top of each other. Chicago's most underrated group stay.",
    listingId: "69b863afab91d0002330efdb",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    features: [
      "3 private bedrooms",
      "2 full bathrooms",
      "Full kitchen",
      "Open living & dining area",
      "Smart TVs throughout",
      "In-unit washer/dryer",
      "Self check-in",
      "Rooftop + lobby lounge",
    ],
    idealFor: "Friend Groups · Bachelorette Parties · Family Travel",
    image: "/images/living-dark.jpg",
    alt: "Three bedroom suite with dark charcoal mural and large windows",
  },
  {
    slug: "4br",
    name: "The Four Bedroom",
    tagline: "The whole floor. All yours.",
    description:
      "Four bedrooms for up to 10 guests. Maximum space, maximum privacy. The largest layout in the building — ideal for executive retreats, large family gatherings, or groups that want to arrive together and leave together.",
    listingId: "69b866a2139149001c905bfa",
    maxGuests: 10,
    bedrooms: 4,
    bathrooms: 2,
    features: [
      "4 private bedrooms",
      "2 full bathrooms",
      "Full kitchen",
      "Dining table for 8+",
      "Multiple living areas",
      "In-unit washer/dryer",
      "Self check-in",
      "Rooftop, lobby lounge, conference room",
    ],
    idealFor: "Large Groups · Corporate Retreats · Special Events",
    image: "/images/kitchen-navy.jpg",
    alt: "Four bedroom suite open kitchen and living area with navy accents",
  },
];

export function getRoom(slug: string): RoomType | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

export function getRoomByListingId(id: string): RoomType | undefined {
  return ROOMS.find((r) => r.listingId === id);
}
