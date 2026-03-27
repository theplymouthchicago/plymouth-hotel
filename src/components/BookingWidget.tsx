"use client";

import { useState } from "react";

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

export function BookingWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const nights =
    checkIn && checkOut
      ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)
      : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const room = selectedRoom || "Not selected";
    const subject = encodeURIComponent(`Reservation Request — ${room} | ${checkIn || "TBD"} to ${checkOut || "TBD"}`);
    const body = encodeURIComponent(
      `Hi Plymouth Chicago Team,\n\nI'd like to reserve a room.\n\nName: ${name}\nPhone: ${phone || "N/A"}\nRoom Type: ${room}\nCheck In: ${checkIn || "TBD"}\nCheck Out: ${checkOut || "TBD"}\nGuests: ${guests}\n\nPlease confirm availability and send payment details.\n\nThank you!`
    );
    window.location.href = `mailto:info@theplymouthchicago.com?subject=${subject}&body=${body}&reply-to=${encodeURIComponent(email)}`;
    setSubmitted(true);
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ROOM_TYPES.map((room) => (
            <div key={room.type}
              onClick={() => setSelectedRoom(room.type)}
              className={`bg-white shadow-sm border-2 flex flex-col cursor-pointer transition-colors ${selectedRoom === room.type ? "border-plymouth-gold" : "border-gray-100 hover:border-gray-300"}`}>
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
                  <p className="text-xs text-plymouth-charcoal mb-3">{nights} {nights === 1 ? "night" : "nights"} selected</p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedRoom(room.type); const el = document.getElementById("inquiry-form"); if(el) el.scrollIntoView({behavior:"smooth"}); }}
                  className={`w-full py-3 text-sm uppercase tracking-widest transition-colors ${selectedRoom === room.type ? "bg-plymouth-gold text-white" : "bg-plymouth-black text-white hover:bg-plymouth-gold"}`}>
                  {selectedRoom === room.type ? "Selected ✓" : "Select Room"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form" className="bg-white shadow-md rounded-sm p-8 max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-3">✓</p>
              <p className="font-display text-2xl text-plymouth-black mb-3">You&apos;re almost there!</p>
              <p className="text-plymouth-charcoal">
                Your email client opened with your request pre-filled. Hit send and our team will confirm within 1 hour.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Or call us directly: <a href="tel:7088660029" className="underline text-plymouth-black">(708) 866-0029</a>
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl text-plymouth-black mb-2">
                {selectedRoom ? `Reserve Your ${selectedRoom} Suite` : "Request a Reservation"}
              </h3>
              <p className="text-plymouth-charcoal text-sm mb-6">
                Fill out the form and we&apos;ll confirm your stay within 1 hour.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Full Name *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold"
                      placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Email *</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold"
                      placeholder="jane@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold"
                      placeholder="(312) 555-0100" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-plymouth-charcoal mb-2">Room Type</label>
                    <select value={selectedRoom ?? ""} onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-4 py-3 text-plymouth-black focus:outline-none focus:border-plymouth-gold">
                      <option value="">Select a room</option>
                      {ROOM_TYPES.map((r) => <option key={r.type} value={r.type}>{r.label}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-plymouth-black text-white py-4 text-sm uppercase tracking-widest hover:bg-plymouth-gold transition-colors">
                  Send Reservation Request
                </button>
                <p className="text-center text-xs text-gray-400">
                  Or call us: <a href="tel:7088660029" className="underline text-plymouth-black">(708) 866-0029</a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
