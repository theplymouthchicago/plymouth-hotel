import { guestyOpenFetch } from "@/app/api/guesty/open-client";

// Pulls Guesty's publicDescription block — the source of the long-form
// content shown on the Guesty-hosted property page (Description / The Space /
// Guest Access / Neighborhood / Interaction / Getting Around / Other things
// to note / House Rules). All 6 units in a Plymouth floorplan share the same
// descriptions, so the per-floorplan detail pages all read from the canonical
// listing.

export interface ListingDescription {
  summary?: string;
  space?: string;
  access?: string;
  neighborhood?: string;
  interactionWithGuests?: string;
  transit?: string;
  notes?: string;
  houseRules?: string;
}

interface GuestyListingPublicDescription {
  publicDescription?: ListingDescription;
}

export async function getListingDescription(
  listingId: string,
): Promise<ListingDescription> {
  try {
    const data = (await guestyOpenFetch(
      `/v1/listings/${listingId}?fields=publicDescription`,
    )) as GuestyListingPublicDescription;
    return data.publicDescription ?? {};
  } catch (err) {
    console.warn(
      `getListingDescription(${listingId}) failed:`,
      err instanceof Error ? err.message : err,
    );
    return {};
  }
}
