import { NextRequest, NextResponse } from "next/server";
import { guestyFetch } from "../client";

// All Plymouth listing IDs grouped by room type
const ROOM_TYPES = {
  "2BR": [
    "69b8610659a0a7001528058c", // 1101
    "69c1bd1878b77900124fa0bc", // 1001
    "69c2eede4051c40014406b29", // 901
    "69c5ae86898bb70013d2c9d0", // 601
    "69c5bd70d32c0f0013de5a9c", // 701
    "69c5bdb0272bdf0013622c55", // 801
  ],
  "3BR": [
    "69b863afab91d0002330efdb", // 1102
    "69c1c0d483895f0016ffe345", // 1002
    "69c2f0395c56d500145ed085", // 902
    "69c5af97272bdf00135fd431", // 602
    "69c5bd82184b60001569d420", // 702
    "69c5bdbfe0c8ea0014e4f0f9", // 802
  ],
  "4BR": [
    "69b866a2139149001c905bfa", // 1103
    "69c1d305dbed970015008257", // 1003
    "69c2f133f460340014eab76b", // 903
    "69c5aff0fab0e500138dfec3", // 603
    "69c5bd90c91a6c0013265ccd", // 703
    "69c5bdcd53cb7d00146504cf", // 803
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  

  try {
    // Fetch all listings (with dates if provided for availability filter)
    const params = new URLSearchParams({ limit: "100" });
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    const data = await guestyFetch(`/listings?${params}`);
    const listings: Record<string, unknown>[] = data.results ?? [];

    // Map listing IDs to room types
    const listingMap: Record<string, string> = {};
    for (const [type, ids] of Object.entries(ROOM_TYPES)) {
      for (const id of ids) listingMap[id] = type;
    }

    // Group available listings by room type
    const available: Record<string, unknown[]> = { "2BR": [], "3BR": [], "4BR": [] };
    for (const listing of listings) {
      const id = listing._id as string;
      const type = listingMap[id];
      if (!type) continue;
      if (listing.status === "unavailable") continue;

      available[type].push({
        id,
        nickname: listing.nickname,
        title: listing.title,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        accommodates: listing.accommodates,
        prices: listing.prices,
        picture: listing.picture,
        address: listing.address,
      });
    }

    // Return one representative per room type (first available)
    const roomTypes = Object.entries(available)
      .filter(([, units]) => units.length > 0)
      .map(([type, units]) => {
        const unit = units[0] as Record<string, unknown>;
        return {
          type,
          available: units.length,
          listingId: unit.id,
          title: unit.title,
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          accommodates: unit.accommodates,
          basePrice: (unit.prices as Record<string, unknown>)?.basePrice,
          picture: (unit.picture as Record<string, unknown>)?.thumbnail,
        };
      });

    return NextResponse.json({ roomTypes, checkIn, checkOut });
  } catch (err) {
    console.error("Guesty rooms error:", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
