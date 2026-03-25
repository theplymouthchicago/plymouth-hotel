import Image from "next/image";

const photos = [
  { src: "/images/living-blue-mural.jpg", alt: "Bold colorful abstract mural with dining table and multiple bedrooms visible" },
  { src: "/images/living-gray-mural.jpg", alt: "Gray suite with colorful abstract mural, large dining table, and windows" },
  { src: "/images/living-green.jpg", alt: "Teal green mural wall living room with dining table and city views" },
  { src: "/images/living-dark.jpg", alt: "Dark charcoal mural living room with large windows" },
  { src: "/images/kitchen-navy.jpg", alt: "Navy blue open kitchen and living area with full appliances and city view" },
  { src: "/images/living-red.jpg", alt: "Red accent wall living and dining room with city views" },
  { src: "/images/living-red-mural.jpg", alt: "Red and brown abstract mural with dining area and kitchen visible" },
  { src: "/images/living-red-mural-2.jpg", alt: "Red mural with marble dining table, kitchenette, and bedroom visible" },
  { src: "/images/bedroom-red.jpg", alt: "Red accent wall bedroom with tufted headboard and clean white bedding" },
  { src: "/images/door-901.jpg", alt: "Illuminated room number 901 door sign with smart lock" },
  { src: "/images/living-red-mural-3.jpg", alt: "Red mural living room with green sofa, city views, and dining area" },
  { src: "/images/living-gray-mural-2.jpg", alt: "Gray mural suite with velvet sofa, dining table, and skyline views" },
  { src: "/images/living-blue-mural-2.jpg", alt: "Blue abstract mural living room with kitchen and bedroom doors" },
  { src: "/images/living-green-2.jpg", alt: "Green accent wall suite with dining table and city views" },
  { src: "/images/bedroom-plaid.jpg", alt: "Plaid wallpaper bedroom with king bed and city views" },
];

export function PhotoGallery() {
  return (
    <section className="py-section section-padding bg-plymouth-black" id="gallery">
      <div className="max-w-container-lg mx-auto">
        <div className="text-center mb-16">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            The Rooms
          </p>
          <h2 className="font-display text-display-lg text-plymouth-white mb-4 text-balance">
            Every Room, Its Own Story.
          </h2>
          <p className="text-plymouth-silver text-lg max-w-2xl mx-auto">
            Each suite at The Plymouth has a distinct design. No two rooms look the same.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.src} className="relative aspect-[4/3] overflow-hidden group">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
