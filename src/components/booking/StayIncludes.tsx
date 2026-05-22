import { getListingAmenities } from "@/lib/listing-amenities";

interface Props {
  listingId: string;
  roomName: string;
}

export async function StayIncludes({ listingId, roomName }: Props) {
  const data = await getListingAmenities(listingId);
  if (!data) return null;

  const headline = [
    data.bedrooms ? `${data.bedrooms} bed` : null,
    data.bathrooms ? `${data.bathrooms} bath` : null,
    data.accommodates ? `sleeps ${data.accommodates}` : null,
    data.areaSquareFeet ? `${data.areaSquareFeet} sq ft` : null,
  ].filter(Boolean).join(" · ");

  return (
    <section
      className="border border-plymouth-charcoal/15 bg-white px-6 py-7 mb-8"
      aria-label={`What's included in ${roomName}`}
    >
      <p className="text-plymouth-brass text-xs uppercase tracking-[0.3em] mb-2">
        Your stay includes
      </p>
      <h2 className="font-display text-2xl text-plymouth-black mb-1">{roomName}</h2>
      {headline && (
        <p className="text-plymouth-charcoal/70 text-sm mb-6">{headline}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
        {data.groups.map((g) => (
          <div key={g.label}>
            <p className="text-plymouth-black text-xs uppercase tracking-[0.2em] mb-2">
              {g.label}
            </p>
            <ul className="text-plymouth-charcoal text-sm leading-relaxed">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
