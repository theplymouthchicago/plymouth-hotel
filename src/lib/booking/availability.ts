import { guestyOpenFetch, GuestyApiError } from "@/app/api/guesty/open-client";
import { extractDays, isUnavailable } from "@/lib/booking/calendar-parse";

export interface AvailabilityResult {
  available: boolean;
  blockedDates: string[];
}

export class AvailabilityError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "AvailabilityError";
    this.status = status;
  }
}

export async function checkAvailability(
  listingId: string,
  checkIn: string,
  checkOut: string,
): Promise<AvailabilityResult> {
  if (!listingId || !checkIn || !checkOut) {
    throw new AvailabilityError("listingId, checkIn, checkOut required", 400);
  }

  let raw: unknown;
  try {
    raw = await guestyOpenFetch(
      `/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${checkIn}&endDate=${checkOut}`,
    );
  } catch (err) {
    if (err instanceof GuestyApiError) {
      throw new AvailabilityError(err.message, err.status >= 400 && err.status < 500 ? 400 : 502);
    }
    throw new AvailabilityError(err instanceof Error ? err.message : "Availability check failed", 500);
  }

  const days = extractDays(raw);
  if (!days) {
    // Calendar shape we don't recognize — let the quote endpoint be the source of truth.
    return { available: true, blockedDates: [] };
  }

  const blocked: string[] = [];
  for (const day of days) {
    // Checkout day isn't a stay day — guests leave that morning.
    if (day.date >= checkOut) continue;
    if (isUnavailable(day)) blocked.push(day.date);
  }

  return { available: blocked.length === 0, blockedDates: blocked };
}

