"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format, addMonths, parseISO } from "date-fns";
import { DateRangePicker, type DateRangeValue } from "./DateRangePicker";
import { GuestSelector } from "./GuestSelector";

interface Props {
  roomSlug: string;
  maxGuests: number;
  listingId: string;
}

export function RoomBookingControls({ roomSlug, maxGuests, listingId }: Props) {
  const router = useRouter();
  const [range, setRange] = useState<DateRangeValue>({});
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    const ctl = new AbortController();
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addMonths(new Date(), 12), "yyyy-MM-dd");
    fetch(
      `/api/booking/blocked-dates?listingId=${listingId}&from=${from}&to=${to}`,
      { signal: ctl.signal },
    )
      .then((r) => r.json())
      .then((j: { blockedDates?: string[] }) => {
        if (Array.isArray(j.blockedDates)) {
          setUnavailableDates(j.blockedDates.map((s) => parseISO(s)));
        }
      })
      .catch(() => {
        // Soft-fail: empty list is safe, booking page still validates.
      });
    return () => ctl.abort();
  }, [listingId]);

  const canSubmit = !!(range.from && range.to);

  const onSubmit = () => {
    if (!range.from || !range.to) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    setSubmitting(true);
    const params = new URLSearchParams({
      checkIn: format(range.from, "yyyy-MM-dd"),
      checkOut: format(range.to, "yyyy-MM-dd"),
      guests: String(guests),
    });
    router.push(`/book/${roomSlug}?${params.toString()}`);
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
