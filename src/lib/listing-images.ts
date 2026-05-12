import { guestyOpenFetch } from "@/app/api/guesty/open-client";

export interface ListingImages {
  primary: string;
  primaryAlt: string;
  gallery: { url: string; alt: string }[];
}

interface GuestyListingPictures {
  title?: string;
  picture?: {
    regular?: string;
    large?: string;
    thumbnail?: string;
    caption?: string;
  };
  pictures?: Array<{
    original?: string;
    thumbnail?: string;
    caption?: string;
  }>;
}

const FALLBACK_IMAGES: Record<string, string> = {
  "69b8610659a0a7001528058c": "/images/living-green.jpg",
  "69b863afab91d0002330efdb": "/images/living-dark.jpg",
  "69b866a2139149001c905bfa": "/images/kitchen-navy.jpg",
};

const FALLBACK_ALT: Record<string, string> = {
  "69b8610659a0a7001528058c": "Two bedroom suite living room",
  "69b863afab91d0002330efdb": "Three bedroom suite with dark accents",
  "69b866a2139149001c905bfa": "Four bedroom suite kitchen and living area",
};

export async function getListingImages(listingId: string): Promise<ListingImages> {
  try {
    const data = (await guestyOpenFetch(
      `/v1/listings/${listingId}?fields=picture+pictures+title`
    )) as GuestyListingPictures;

    const primary =
      data.picture?.regular || data.picture?.large || data.picture?.thumbnail || FALLBACK_IMAGES[listingId];
    const primaryAlt =
      data.picture?.caption || data.title || FALLBACK_ALT[listingId] || "Plymouth suite";

    const gallery = (data.pictures ?? [])
      .map((p) => ({
        url: p.original || p.thumbnail || "",
        alt: p.caption || data.title || FALLBACK_ALT[listingId] || "Plymouth suite",
      }))
      .filter((p) => !!p.url);

    return { primary, primaryAlt, gallery };
  } catch (err) {
    console.warn(`getListingImages(${listingId}) failed, using fallback:`, err instanceof Error ? err.message : err);
    return {
      primary: FALLBACK_IMAGES[listingId] || "/images/living-green.jpg",
      primaryAlt: FALLBACK_ALT[listingId] || "Plymouth suite",
      gallery: [],
    };
  }
}
