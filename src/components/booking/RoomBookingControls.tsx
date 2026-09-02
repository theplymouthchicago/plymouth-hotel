"use client";

import { useEffect, useState } from "react";
import { format, addMonths, parseISO } from "date-fns";
import { DateRangePicker, type DateRangeValue } from "./DateRangePicker";
import { GuestSelector } from "./GuestSelector";

interface Props {
  roomSlug: string;
  maxGuests: number;
  listingId: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

const GUESTY_HOST = "https://theplymouthchicago.guestybookings.com";

export function RoomBookingControls({ roomSlug, maxGuests, listingId, initialCheckIn = "", initialCheckOut = "" }: Props) {
  const [range, setRange] = useState<DateRangeValue>({});
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const ctl = new AbortController();
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addMonths(new Date(), 12), "yyyy-MM-dd");
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
      .catch(() => {});
    return () => ctl.abort();
  }, [roomSlug, listingId]);

  const today = format(new Date(), "yyyy-MM-dd");

  const mobileCanSubmit = !!(checkIn && checkOut && checkOut > checkIn);
  const desktopCanSubmit = !!(range.from && range.to);
  const canSubmit = isMobile ? mobileCanSubmit : desktopCanSubmit;

  const onSubmit = () => {
    const ci = isMobile ? checkIn : (range.from ? format(range.from, "yyyy-MM-dd") : "");
    const co = isMobile ? checkOut : (range.to ? format(range.to, "yyyy-MM-dd") : "");

    if (!ci || !co) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    setSubmitting(true);
    const params = new URLSearchParams({
      checkIn: ci,
      checkOut: co,
      minOccupancy: String(guests),
      adults: String(guests),
    });
    window.location.href = `${GUESTY_HOST}/en/properties/${listingId}?${params.toString()}`;
  };

  return (
    <div>
      {isMobile ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-plymouth-gold mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => { setCheckIn(e.target.value); setCheckOut(""); setError(null); }}
              className="w-full bg-white border border-gray-300 px-3 py-3 text-sm text-plymouth-black focus:outline-none focus:border-plymouth-gold"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-plymouth-gold mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => { setCheckOut(e.target.value); setError(null); }}
              className="w-full bg-white border border-gray-300 px-3 py-3 text-sm text-plymouth-black focus:outline-none focus:border-plymouth-gold"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <DateRangePicker
            value={range}
            onChange={(r) => { setRange(r); setError(null); }}
            variant="light"
            unavailableDates={unavailableDates}
          />
          <GuestSelector value={guests} onChange={setGuests} max={maxGuests} variant="light" />
        </div>
      )}
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
