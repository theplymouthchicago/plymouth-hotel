"use client";

import { useEffect, useState } from "react";
import { format, addMonths, parseISO } from "date-fns";
import { DateRangePicker, type DateRangeValue } from "./DateRangePicker";
import { GuestSelector } from "./GuestSelector";

interface Props {
  roomSlug: string;
  maxGuests: number;
  listingId: string;
}

// Routes guests to the Guesty-hosted property page (theplymouthchicago.guestybookings.com)
// with dates + guest count pre-filled. This is the "revert to Guesty embed"
// path — the in-house /book/[type] flow is preserved on the
// feature/custom-booking-flow-2026-05-22 branch for future restoration.
const GUESTY_BOOKING_HOST = "https://theplymouthchicago.guestybookings.com";

export function RoomBookingControls({ roomSlug, maxGuests, listingId }: Props) {
  const [range, setRange] = useState<DateRangeValue>({});
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    const ctl = new AbortController();
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addMonths(new Date(), 12), "yyyy-MM-dd");
    // Aggregate availability across all sibling units of this floorplan —
    // only mark a date as blocked if every 2BR (or 3BR / 4BR) unit is taken.
    fetch(
      `/api/booking/blocked-dates?floorplan=${encodeURIComponent(roomSlug)}&from=${from}&to=${to}`,
      { signal: ctl.signal },
    )
      .then((r) => r.json())
      .then((j: { blockedDates?: string[] }) => {
        if (Array.isArray(j.blockedDates)) {
          setUnavailableDates(j.blockedDates.map((s) => parseISO(s)));
        }
      })
      .catch(() => {
        // Soft-fail: empty list is safe.
      });
    return () => ctl.abort();
  }, [roomSlug, listingId]);

  const canSubmit = !!(range.from && range.to);

  const onSubmit = () => {
    if (!range.from || !range.to) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    setSubmitting(true);
    const params = new URLSearchParams({
      minOccupancy: String(guests),
      checkIn: format(range.from, "yyyy-MM-dd"),
      checkOut: format(range.to, "yyyy-MM-dd"),
    });
    window.location.href = `${GUESTY_BOOKING_HOST}/en/properties/${listingId}?${params.toString()}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <DateRangePicker value={range} onChange={(r) => { setRange(r); setError(null); }} variant="light" unavailableDates={unavailableDates} />
        <GuestSelector value={guests} onChange={setGuests} max={maxGuests} variant="light" />
      </div>
      {error && <p className="text-red-700 text-xs mb-3">{error}</p>}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
        className="inline-flex items-center gap-3 bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-plymouth-gold hover:text-black transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Loading…" : "Book This Suite"}
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
}
