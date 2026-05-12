"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import { DateRangePicker, type DateRangeValue } from "./booking/DateRangePicker";
import { GuestSelector } from "./booking/GuestSelector";

const SUITES = [
  { slug: "2br", label: "2 Bedroom", subtitle: "Up to 4 guests", maxGuests: 4 },
  { slug: "3br", label: "3 Bedroom", subtitle: "Up to 6 guests", maxGuests: 6 },
  { slug: "4br", label: "4 Bedroom", subtitle: "Up to 10 guests", maxGuests: 10 },
];

export function HomepageSearch() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [suiteSlug, setSuiteSlug] = useState<string>("2br");
  const [range, setRange] = useState<DateRangeValue>({
    from: addDays(today, 14),
    to: addDays(today, 17),
  });
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const suite = SUITES.find((s) => s.slug === suiteSlug)!;
  const cappedGuests = Math.min(guests, suite.maxGuests);

  const submit = () => {
    if (!range.from || !range.to) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    setSubmitting(true);
    const params = new URLSearchParams({
      checkIn: format(range.from, "yyyy-MM-dd"),
      checkOut: format(range.to, "yyyy-MM-dd"),
      guests: String(cappedGuests),
    });
    router.push(`/book/${suiteSlug}?${params.toString()}`);
  };

  return (
    <section
      id="booking"
      className="relative py-section section-padding bg-plymouth-forest"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-plymouth-brass/40 to-transparent" />

      <div className="max-w-container mx-auto relative z-10">
        <div className="text-center mb-10">
          <p className="text-plymouth-brass font-body text-sm uppercase tracking-[0.3em] mb-4">
            Reserve
          </p>
          <h2 className="font-display text-display-md text-plymouth-cream mb-4">
            Book Direct. Best Rate.
          </h2>
          <p className="text-plymouth-cream/60 text-lg max-w-xl mx-auto">
            Skip the third-party fees. Instant confirmation, secure checkout,
            best rate guaranteed.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-plymouth-forest-deep/60 backdrop-blur-sm border border-plymouth-brass/20 p-5 sm:p-7 shadow-2xl">
          {/* Suite pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
            {SUITES.map((s) => {
              const active = s.slug === suiteSlug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => {
                    setSuiteSlug(s.slug);
                    if (guests > s.maxGuests) setGuests(s.maxGuests);
                    setError(null);
                  }}
                  className={`px-3 py-3 sm:py-3.5 text-center transition-colors border ${
                    active
                      ? "bg-plymouth-brass border-plymouth-brass text-plymouth-forest-deep"
                      : "bg-transparent border-plymouth-cream/20 text-plymouth-cream hover:border-plymouth-brass/60"
                  }`}
                >
                  <div className="text-sm font-display tracking-wide uppercase leading-tight">
                    {s.label}
                  </div>
                  <div
                    className={`text-[10px] uppercase tracking-[0.18em] mt-0.5 ${
                      active ? "text-plymouth-forest-deep/70" : "text-plymouth-cream/50"
                    }`}
                  >
                    {s.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dates + guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <DateRangePicker
              value={range}
              onChange={(r) => {
                setRange(r);
                setError(null);
              }}
              variant="dark"
              className=""
            />
            <GuestSelector
              value={cappedGuests}
              onChange={setGuests}
              max={suite.maxGuests}
              variant="dark"
            />
          </div>

          {error && (
            <p className="text-red-300 text-xs mb-3 uppercase tracking-[0.2em]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full bg-plymouth-brass text-plymouth-forest-deep py-4 text-sm uppercase tracking-[0.25em] font-semibold hover:bg-plymouth-cream transition-colors disabled:opacity-50"
          >
            {submitting ? "Checking…" : "Check Availability"}
          </button>
        </div>

        <p className="text-center text-xs text-plymouth-cream/40 mt-6 tracking-wider">
          Instant booking · Secure checkout · Best rate guaranteed
        </p>
      </div>
    </section>
  );
}
