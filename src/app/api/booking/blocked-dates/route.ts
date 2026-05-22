import { NextRequest, NextResponse } from "next/server";
import { guestyOpenFetch, GuestyApiError } from "@/app/api/guesty/open-client";

// Returns YYYY-MM-DD strings for dates that are NOT bookable on a given
// listing within [from, to]. Used to grey out / strike through blocked
// nights in the room-page DateRangePicker so guests can't pick dates
// that will immediately reject on the confirmation page.
//
// Cached at the edge for 30 min — the underlying Guesty token fetch
// already routes through the Edge Config cache shipped in a325e53.

export const dynamic = "force-dynamic";

interface CalendarDay {
  date: string;
  status?: string;
  available?: boolean;
  isAvailable?: boolean;
}

function extractDays(raw: unknown): CalendarDay[] | null {
  if (Array.isArray(raw)) return raw as CalendarDay[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["data", "days", "results"]) {
      const v = obj[key];
      if (Array.isArray(v)) return v as CalendarDay[];
    }
  }
  return null;
}

function isUnavailable(day: CalendarDay): boolean {
  if (typeof day.available === "boolean") return !day.available;
  if (typeof day.isAvailable === "boolean") return !day.isAvailable;
  if (typeof day.status === "string") {
    return !["available", "open"].includes(day.status.toLowerCase());
  }
  return false;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!listingId || !from || !to) {
    return NextResponse.json(
      { error: "listingId, from, to required" },
      { status: 400 },
    );
  }

  try {
    const raw = await guestyOpenFetch(
      `/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${from}&endDate=${to}`,
    );
    const days = extractDays(raw) ?? [];
    const blockedDates = days.filter(isUnavailable).map((d) => d.date);
    return NextResponse.json(
      { blockedDates },
      { headers: { "Cache-Control": "public, max-age=1800, s-maxage=1800" } },
    );
  } catch (err) {
    const message =
      err instanceof GuestyApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Failed to load availability";
    // Soft-fail with an empty list — booking page will still validate at
    // checkout. Better than a broken picker for a temporary Guesty hiccup.
    console.warn(`blocked-dates(${listingId}) failed:`, message);
    return NextResponse.json(
      { blockedDates: [], warning: message },
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  }
}
