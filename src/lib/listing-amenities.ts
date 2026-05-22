import { guestyOpenFetch } from "@/app/api/guesty/open-client";

export interface AmenityGroup {
  label: string;
  items: string[];
}

export interface ListingAmenities {
  bedrooms?: number;
  bathrooms?: number;
  accommodates?: number;
  areaSquareFeet?: number;
  groups: AmenityGroup[];
}

interface GuestyListingFields {
  bedrooms?: number;
  bathrooms?: number;
  accommodates?: number;
  areaSquareFeet?: number;
  amenities?: string[];
}

// Guesty mixes "amenities" with neighborhood-category tags. These are not
// unit features and would clutter the booking summary.
const NEIGHBORHOOD_TAGS = new Set([
  "Casinos", "Downtown", "Fishing", "Golf - Optional",
  "Museums", "Shopping", "Water Sports", "Zoo",
]);

// Map raw Guesty amenity strings → display group label. Anything not in this
// map is dropped from the booking card (keeps the card focused on what guests
// actually care about; new amenities Guesty introduces will appear after we
// extend this map).
const GROUP_FOR: Record<string, string> = {
  // Sleeping
  "Bed linens": "Sleeping",
  "Extra pillows and blankets": "Sleeping",

  // Kitchen
  "BBQ grill": "Kitchen",
  "Baking sheet": "Kitchen",
  "Barbeque utensils": "Kitchen",
  "Coffee": "Kitchen",
  "Coffee maker": "Kitchen",
  "Cookware": "Kitchen",
  "Dishes and silverware": "Kitchen",
  "Dishwasher": "Kitchen",
  "Freezer": "Kitchen",
  "Ice maker": "Kitchen",
  "Kitchen": "Kitchen",
  "Microwave": "Kitchen",
  "Oven": "Kitchen",
  "Refrigerator": "Kitchen",
  "Stove": "Kitchen",
  "Toaster": "Kitchen",
  "Trash compactor": "Kitchen",
  "Wine glasses": "Kitchen",

  // Bath
  "Body soap": "Bath",
  "Conditioner": "Bath",
  "Hair dryer": "Bath",
  "Shampoo": "Bath",
  "Shower gel": "Bath",
  "Towels provided": "Bath",

  // Tech & Climate
  "Air conditioning": "Tech & Climate",
  "Heating": "Tech & Climate",
  "Hot water": "Tech & Climate",
  "Internet": "Tech & Climate",
  "TV": "Tech & Climate",
  "Wireless Internet": "Tech & Climate",

  // Building & Outdoor
  "Elevator": "Building & Outdoor",
  "Gym": "Building & Outdoor",
  "Outdoor seating (furniture)": "Building & Outdoor",
  "Paid parking off premises": "Building & Outdoor",
  "Patio or balcony": "Building & Outdoor",
  "Ping pong table": "Building & Outdoor",
  "Pool table": "Building & Outdoor",

  // Check-in & Safety
  "Carbon monoxide detector": "Check-in & Safety",
  "Cleaning products": "Check-in & Safety",
  "Clothing storage": "Check-in & Safety",
  "Dryer": "Check-in & Safety",
  "Dryer in common space": "Check-in & Safety",
  "Emergency exit": "Check-in & Safety",
  "Essentials": "Check-in & Safety",
  "Fire extinguisher": "Check-in & Safety",
  "Hangers": "Check-in & Safety",
  "Iron": "Check-in & Safety",
  "Luggage dropoff allowed": "Check-in & Safety",
  "Smoke detector": "Check-in & Safety",
  "Washer": "Check-in & Safety",
  "Washer in common space": "Check-in & Safety",

  // Policies
  "Long term stays allowed": "Policies",
  "Suitable for children (2-12 years)": "Policies",
  "Suitable for infants (under 2 years)": "Policies",
};

const GROUP_ORDER = [
  "Sleeping", "Kitchen", "Bath",
  "Tech & Climate", "Building & Outdoor",
  "Check-in & Safety", "Policies",
];

export async function getListingAmenities(listingId: string): Promise<ListingAmenities | null> {
  try {
    const data = (await guestyOpenFetch(
      `/v1/listings/${listingId}?fields=bedrooms+bathrooms+accommodates+areaSquareFeet+amenities`
    )) as GuestyListingFields;

    const buckets: Record<string, Set<string>> = {};
    for (const raw of data.amenities ?? []) {
      if (NEIGHBORHOOD_TAGS.has(raw)) continue;
      const group = GROUP_FOR[raw];
      if (!group) continue;
      (buckets[group] ??= new Set()).add(raw);
    }

    const groups: AmenityGroup[] = GROUP_ORDER
      .filter((g) => buckets[g] && buckets[g].size > 0)
      .map((g) => ({ label: g, items: Array.from(buckets[g]).sort() }));

    if (groups.length === 0) return null;

    return {
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      accommodates: data.accommodates,
      areaSquareFeet: data.areaSquareFeet,
      groups,
    };
  } catch (err) {
    console.warn(
      `getListingAmenities(${listingId}) failed:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
