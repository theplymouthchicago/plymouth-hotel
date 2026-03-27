import { NextRequest, NextResponse } from "next/server";
import { guestyFetch } from "../client";

const ROOM_TYPES: Record<string, string[]> = {
  "2BR": [
    "69b8610659a0a7001528058c","69c1bd1878b77900124fa0bc",
    "69c2eede4051c40014406b29","69c5ae86898bb70013d2c9d0",
    "69c5bd70d32c0f0013de5a9c","69c5bdb0272bdf0013622c55",
  ],
  "3BR": [
    "69b863afab91d0002330efdb","69c1c0d483895f0016ffe345",
    "69c2f0395c56d500145ed085","69c5af97272bdf00135fd431",
    "69c5bd82184b60001569d420","69c5bdbfe0c8ea0014e4f0f9",
  ],
  "4BR": [
    "69b866a2139149001c905bfa","69c1d305dbed970015008257",
    "69c2f133f460340014eab76b","69c5aff0fab0e500138dfec3",
    "69c5bd90c91a6c0013265ccd","69c5bdcd53cb7d00146504cf",
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  try {
    const params = new URLSearchParams({ limit: "100" });
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    const data = await guestyFetch(`/listings?${params}`);

    if (data.error || data.message) {
      return NextResponse.json({ error: data.error?.message || data.message, raw: data }, { status: 502 });
    }

    const listings: Record<string, unknown>[] = data.results ?? [];
    const listingMap: Record<string, string> = {};
    for (const [type, ids] of Object.entries(ROOM_TYPES)) {
      for (const id of ids) listingMap[id] = type;
    }

    const available: Record<string, unknown[]> = { "2BR": [], "3BR": [], "4BR": [] };
    for (const listing of listings) {
      const id = listing._id as string;
      const type = listingMap[id];
      if (!type) continue;
      available[type].push({
        id, nickname: listing.nickname, title: listing.title,
        bedrooms: listing.bedrooms, bathrooms: listing.bathrooms,
        accommodates: listing.accommodates, prices: listing.prices,
        picture: listing.picture,
      });
    }

    const roomTypes = Object.entries(available)
      .filter(([, units]) => units.length > 0)
      .map(([type, units]) => {
        const unit = units[0] as Record<string, unknown>;
        return {
          type, available: units.length, listingId: unit.id,
          title: unit.title, bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms, accommodates: unit.accommodates,
          basePrice: (unit.prices as Record<string, unknown>)?.basePrice,
          picture: (unit.picture as Record<string, unknown>)?.thumbnail,
        };
      });

    return NextResponse.json({ roomTypes, checkIn, checkOut });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Guesty rooms error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
