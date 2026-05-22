import { NextRequest, NextResponse } from "next/server";
import { guestyOpenFetch } from "@/app/api/guesty/open-client";
import { extractDays, isUnavailable } from "@/lib/booking/calendar-parse";
import { FLOORPLAN_LISTINGS } from "@/lib/floorplan-listings";

// Returns YYYY-MM-DD strings for dates that are NOT bookable as a CHECK-IN
// for a floorplan within [from, to].
//
// "Blocked" semantic in floorplan mode: a date is blocked iff no single
// sibling unit has both that date AND the following date available. This
// matches Guesty's reality — a reservation has to be one contiguous range
// on one physical unit. A date that is "free" on unit A but lacks any
// 2-night contiguous run on any sibling shouldn't be marked green, since
// the booking page will end up refusing it.
//
// (Per-night aggregation — "blocked iff every unit blocks this date" —
// over-marked the calendar as available for many real-world cases where
// no contiguous stay was possible. See incident note in commit message.)
//
// Single-listing mode (?listingId=X) keeps the simple per-night semantic:
// a date is blocked iff that one unit blocks it.
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

function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
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

  // Fetch one extra day past the requested window so we can validate
  // contiguity for the final date (otherwise it'd always be marked blocked
  // because we don't know the next day's availability).
  const fetchTo = addDaysISO(to, 1);
  const calendars = await Promise.all(
    listingIds.map((id) => fetchCalendar(id, from, fetchTo)),
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

  // Single-listing mode → per-night semantic (a date is blocked iff this
  // one unit blocks it). Keeps backwards-compat for any caller that wants
  // per-unit data without contiguity reasoning.
  if (!floorplan) {
    const days = calendars[0]!;
    const blockedDates = days
      .filter((d) => isUnavailable(d) && d.date <= to)
      .map((d) => d.date)
      .sort();
    return NextResponse.json(
      { blockedDates },
      { headers: { "Cache-Control": "public, max-age=1800, s-maxage=1800" } },
    );
  }

  // Floorplan mode → contiguity-aware. Build a per-unit set of AVAILABLE
  // dates. A check-in date is "bookable" iff at least one sibling has both
  // that date AND the next date available — i.e. there's at least a
  // 2-night stay starting there on the same unit.
  const availableByUnit: Set<string>[] = calendars.map(
    (days) =>
      new Set(days!.filter((d) => !isUnavailable(d)).map((d) => d.date)),
  );

  const allDatesInWindow = new Set<string>();
  for (const days of calendars) {
    for (const d of days!) {
      if (d.date >= from && d.date <= to) allDatesInWindow.add(d.date);
    }
  }

  const blockedDates: string[] = [];
  for (const date of Array.from(allDatesInWindow).sort()) {
    const nextDate = addDaysISO(date, 1);
    const someUnitCanStart = availableByUnit.some(
      (units) => units.has(date) && units.has(nextDate),
    );
    if (!someUnitCanStart) blockedDates.push(date);
  }

  return NextResponse.json(
    { blockedDates },
    { headers: { "Cache-Control": "public, max-age=1800, s-maxage=1800" } },
  );
}
