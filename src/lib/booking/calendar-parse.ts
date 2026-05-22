// Shared parsing for Guesty calendar responses.
//
// Guesty's /v1/availability-pricing/api/calendar/listings/{id} returns:
//   { status: 200, data: { days: [ { date, status, blocks, ... }, ... ] } }
//
// Older endpoints and some account variants return flatter shapes
// ({ days: [...] }, { results: [...] }, or even a bare array). This helper
// handles all of them so callers don't silently fall back to "everything is
// available" when Guesty changes the wire format.

export interface CalendarDay {
  date: string;
  status?: string;
  available?: boolean;
  isAvailable?: boolean;
  blocks?: unknown;
}

export function extractDays(raw: unknown): CalendarDay[] | null {
  if (Array.isArray(raw)) return raw as CalendarDay[];
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;
  for (const key of ["data", "days", "results"]) {
    const v = obj[key];
    if (Array.isArray(v)) return v as CalendarDay[];
    // Nested shape: { data: { days: [...] } } — current Guesty default.
    if (v && typeof v === "object") {
      const inner = v as Record<string, unknown>;
      for (const k2 of ["days", "results", "data"]) {
        const arr = inner[k2];
        if (Array.isArray(arr)) return arr as CalendarDay[];
      }
    }
  }
  return null;
}

const AVAILABLE_STATUSES = new Set(["available", "open"]);

export function isUnavailable(day: CalendarDay): boolean {
  if (typeof day.available === "boolean") return !day.available;
  if (typeof day.isAvailable === "boolean") return !day.isAvailable;
  if (typeof day.status === "string") {
    return !AVAILABLE_STATUSES.has(day.status.toLowerCase());
  }
  return false;
}
