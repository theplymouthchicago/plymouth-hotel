import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

const photos = [
  { src: "/images/living-blue-mural.jpg", alt: "Bold colorful abstract mural with dining table and multiple bedrooms visible", tall: true },
  { src: "/images/living-gray-mural.jpg", alt: "Gray suite with colorful abstract mural, large dining table, and windows", tall: false },
  { src: "/images/living-green.jpg", alt: "Teal green mural wall living room with dining table and city views", tall: false },
  { src: "/images/living-dark.jpg", alt: "Dark charcoal mural living room with large windows", tall: true },
  { src: "/images/kitchen-navy.jpg", alt: "Navy blue open kitchen and living area with full appliances and city view", tall: false },
  { src: "/images/living-red.jpg", alt: "Red accent wall living and dining room with city views", tall: true },
  { src: "/images/living-red-mural.jpg", alt: "Red and brown abstract mural with dining area and kitchen visible", tall: false },
  { src: "/images/living-red-mural-2.jpg", alt: "Red mural with marble dining table, kitchenette, and bedroom visible", tall: true },
  { src: "/images/bedroom-red.jpg", alt: "Red accent wall bedroom with tufted headboard and clean white bedding", tall: false },
  { src: "/images/door-901.jpg", alt: "Illuminated room number 901 door sign with smart lock", tall: true },
  { src: "/images/living-red-mural-3.jpg", alt: "Red mural living room with green sofa, city views, and dining area", tall: false },
  { src: "/images/living-gray-mural-2.jpg", alt: "Gray mural suite with velvet sofa, dining table, and skyline views", tall: false },
  { src: "/images/living-blue-mural-2.jpg", alt: "Blue abstract mural living room with kitchen and bedroom doors", tall: true },
  { src: "/images/living-green-2.jpg", alt: "Green accent wall suite with dining table and city views", tall: false },
  { src: "/images/bedroom-plaid.jpg", alt: "Plaid wallpaper bedroom with king bed and city views", tall: false },
];

export function PhotoGallery() {
  return (
    <section className="py-section section-padding bg-plymouth-black" id="gallery">
      <div className="max-w-container-lg mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-plymouth-gold font-body text-sm uppercase tracking-[0.3em] mb-4">
            The Design
          </p>
          <h2 className="font-display text-display-lg text-plymouth-white mb-4 text-balance">
            No Two Rooms Alike
          </h2>
          <p className="text-plymouth-silver text-lg max-w-xl mx-auto">
            Curated murals. Custom furniture. Every suite is a one-of-a-kind composition.
          </p>
        </ScrollReveal>

        {/* Masonry gallery */}
        <div className="gallery-masonry">
          {photos.map((photo, index) => (
            <ScrollReveal
              key={photo.src}
              delay={index % 3 * 100}
              className="gallery-masonry-item"
            >
              <div className="relative overflow-hidden group">
                <div className={photo.tall ? "aspect-[3/4]" : "aspect-[4/3]"}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-plymouth-black/0 group-hover:bg-plymouth-black/20 transition-colors duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
