"use client";

import { useState } from "react";

const BOOKING_BASE = "https://theplymouthchicago.guestybookings.com/en/properties";

const ROOM_TYPES = [
  {
    type: "2BR",
    label: "Two Bedroom Suite",
    listingId: "69b8610659a0a7001528058c",
    bedrooms: 2,
    bathrooms: 1,
    accommodates: 4,
    description:
      "Ideal for couples or small families. Two comfortable beds, full kitchen, modern bath, and stunning city views.",
  },
  {
    type: "3BR",
    label: "Three Bedroom Suite",
    listingId: "69b863afab91d0002330efdb",
    bedrooms: 3,
    bathrooms: 2,
    accommodates: 6,
    description:
      "Perfect for groups of up to 6. Three private bedrooms, two baths, open living and dining area.",
  },
  {
    type: "4BR",
    label: "Four Bedroom Suite",
    listingId: "69b866a2139149001c905bfa",
    bedrooms: 4,
    bathrooms: 2,
    accommodates: 10,
    description:
      "The ultimate group suite. Four bedrooms for up to 10 guests, rooftop access, lobby lounge and conference room.",
  },
];

function buildBookingUrl(listingId: string, checkIn: string, checkOut: string, guests: number) {
  const params = new URLSearchParams({ minOccupancy: String(guests) });
  if (checkIn) params.set("startDate", checkIn);
  if (checkOut) params.set("endDate", checkOut);
  return `${BOOKING_BASE}/${listingId}?${params}`;
}

export function BookingWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const today = new Date().toISOString().split("T")[0];
  const nights =
    checkIn && checkOut
      ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)
      : 0;

  return (
    <section className="py-section section-padding bg-plymouth-offwhite" id="booking">
      <div className="max-w-container mx-auto">
        <div className="text-center mb-12">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">Reserve</p>
          <h2 className="font-display text-display-md text-plymouth-black mb-4">Book Direct. Best Rate.</h2>
          <p className="text-plymouth-charcoal text-lg max-w-xl mx-auto">
            Skip the third-party fees. Book directly for the best available rate and flexible terms.
          </p>
        </div>

        {/* Date + Guest Picker */}
        <div className="bg-white shadow-md rounded-sm p-6 flex flex-col md:flex-row gap-4 items-end max-w-3xl mx-auto mb-12">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Check In</label>
            <input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold" />
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Check Out</label>
            <input type="date" value={checkOut} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold" />
          </div>
          <div className="w-36">
            <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Guests</label>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROOM_TYPES.map((room) => (
            <div key={room.type} className="bg-white shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="font-display text-3xl text-gray-500">{room.type}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs uppercase tracking-widest text-plymouth-gold mb-2">
                  {room.bedrooms} bed &middot; {room.bathrooms} bath &middot; Up to {room.accommodates} guests
                </p>
                <h3 className="font-display text-xl text-plymouth-black mb-3">{room.label}</h3>
                <p className="text-plymouth-charcoal text-sm mb-4 flex-1">{room.description}</p>
                {nights > 0 && (
                  <p className="text-sm font-medium text-plymouth-black mb-4">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                )}
                <a
                  href={buildBookingUrl(room.listingId, checkIn, checkOut, guests)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-plymouth-black text-white py-3 text-sm uppercase tracking-widest hover:bg-plymouth-gold transition-colors">
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Instant booking &middot; Secure checkout &middot; Powered by Guesty
        </p>
      </div>
    </section>
  );
}
