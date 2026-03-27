"use client";

import { useState } from "react";

type RoomType = {
  type: string;
  available: number;
  listingId: string;
  title: string;
  bedrooms: number;
  bathrooms: number;
  accommodates: number;
  basePrice?: number;
  picture?: string;
};

const ROOM_LABELS: Record<string, string> = {
  "2BR": "Two Bedroom Suite",
  "3BR": "Three Bedroom Suite",
  "4BR": "Four Bedroom Suite",
};

const ROOM_DESCRIPTIONS: Record<string, string> = {
  "2BR": "Ideal for couples or small families. King + queen beds, full kitchen, city views.",
  "3BR": "Perfect for groups of 5–8. Three private bedrooms, two baths, open living.",
  "4BR": "The ultimate group suite. Four bedrooms for up to 10 guests, rooftop access.",
};

export function BookingWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const res = await fetch(
        `/api/guesty/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRooms(data.roomTypes ?? []);
      setSearched(true);
    } catch {
      setError("Unable to check availability right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            86_400_000
        )
      : 0;

  return (
    <section
      className="py-section section-padding bg-plymouth-offwhite"
      id="booking"
    >
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            Reserve
          </p>
          <h2 className="font-display text-display-md text-plymouth-black mb-4">
            Book Direct. Best Rate.
          </h2>
          <p className="text-plymouth-charcoal text-lg max-w-xl mx-auto">
            Skip the third-party fees. Book directly for the best available rate
            and flexible terms.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white shadow-md rounded-sm p-6 flex flex-col md:flex-row gap-4 items-end max-w-3xl mx-auto mb-12"
        >
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-plymouth-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-plymouth-gold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Checking..." : "Check Availability"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 mb-8">{error}</p>
        )}

        {/* Results */}
        {searched && (
          <div>
            {rooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-plymouth-charcoal text-lg">
                  No rooms available for those dates. Try different dates or contact us directly.
                </p>
                <a
                  href="mailto:hello@theplymouthchicago.com"
                  className="inline-block mt-4 text-plymouth-gold underline"
                >
                  Contact Us
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.type}
                    className="bg-white shadow-sm border border-gray-100 flex flex-col"
                  >
                    {room.picture && (
                      <img // eslint-disable-next-line @next/next/no-img-element
                        src={room.picture}
                        alt={ROOM_LABELS[room.type] ?? room.type}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs uppercase tracking-widest text-plymouth-gold mb-2">
                        {room.bedrooms}BR · Up to {room.accommodates} guests
                      </p>
                      <h3 className="font-display text-xl text-plymouth-black mb-3">
                        {ROOM_LABELS[room.type] ?? room.title}
                      </h3>
                      <p className="text-plymouth-charcoal text-sm mb-4 flex-1">
                        {ROOM_DESCRIPTIONS[room.type]}
                      </p>
                      {room.basePrice && nights > 0 && (
                        <p className="text-sm text-plymouth-charcoal mb-4">
                          <span className="font-semibold text-plymouth-black text-lg">
                            ${(room.basePrice * nights).toLocaleString()}
                          </span>{" "}
                          total · ${room.basePrice}/night · {nights}{" "}
                          {nights === 1 ? "night" : "nights"}
                        </p>
                      )}
                      <p className="text-xs text-green-700 mb-4">
                        {room.available}{" "}
                        {room.available === 1 ? "unit" : "units"} available
                      </p>
                      <a
                        href={`https://app.guesty.com/reservations/create?listingId=${room.listingId}&checkIn=${checkIn}&checkOut=${checkOut}&guestsCount=${guests}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-plymouth-black text-white py-3 text-sm uppercase tracking-widest hover:bg-plymouth-gold transition-colors"
                      >
                        Reserve Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
