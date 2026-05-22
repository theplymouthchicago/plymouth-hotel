import { NextRequest, NextResponse } from "next/server";
import { guestyOpenFetch } from "@/app/api/guesty/open-client";
import { extractDays, isUnavailable } from "@/lib/booking/calendar-parse";
import { FLOORPLAN_LISTINGS } from "@/lib/floorplan-listings";

// Returns YYYY-MM-DD strings for dates that are NOT bookable for a floorplan
// within [from, to]. A date is "blocked" only if EVERY unit in the floorplan
// is booked for that night — Plymouth has 6 units per floorplan and the
// booking system can place a guest in any free sibling, so marking a date
// red just because the canonical unit is taken would hide bookable inventory.
//
// Single-listing mode (?listingId=X) is preserved for callers that want
// per-unit data.
//
// Cached at the edge for 30 min — the underlying Guesty token fetch routes
// through the Edge Config cache shipped in a325e53.

export const dynamic = "force-dynamic";

async function fetchCalendar(listingId: string, from: string, to: string) {
  try {
    const raw = await guestyOpenFetch(
      `/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${from}&endDate=${to}`,
    );
    return extractDays(raw) ?? [];
  } catch (err) {
    console.warn(
      `blocked-dates: calendar fetch failed for ${listingId}:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  const floorplan = searchParams.get("floorplan");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if ((!listingId && !floorplan) || !from || !to) {
    return NextResponse.json(
      { error: "(listingId or floorplan), from, to required" },
      { status: 400 },
    );
  }

  const listingIds = floorplan
    ? FLOORPLAN_LISTINGS[floorplan.toUpperCase()] ?? []
    : [listingId!];

  if (listingIds.length === 0) {
    return NextResponse.json(
      { blockedDates: [], warning: `unknown floorplan: ${floorplan}` },
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  }

  const calendars = await Promise.all(
    listingIds.map((id) => fetchCalendar(id, from, to)),
  );

  // If any fetch failed entirely, fail open with empty list. Mismatched
  // partial data would risk marking dates blocked that other units could
  // actually serve.
  if (calendars.some((c) => c === null)) {
    return NextResponse.json(
      { blockedDates: [], warning: "partial-fetch-failure" },
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  }

  // Count blocked nights per date. A date is fully blocked only if every
  // unit in the floorplan reports it blocked.
  const blocksPerDate: Record<string, number> = {};
  for (const days of calendars) {
    for (const day of days!) {
      if (isUnavailable(day)) {
        blocksPerDate[day.date] = (blocksPerDate[day.date] || 0) + 1;
      }
    }
  }
  const blockedDates = Object.keys(blocksPerDate)
    .filter((d) => blocksPerDate[d] >= listingIds.length)
    .sort();

  return NextResponse.json(
    { blockedDates },
    { headers: { "Cache-Control": "public, max-age=1800, s-maxage=1800" } },
  );
}
