import { NextRequest, NextResponse } from "next/server";
import { guestyFetch } from "../client";
import { FLOORPLAN_LISTINGS as ROOM_TYPES } from "@/lib/floorplan-listings";

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
