import { Hero } from "@/components/Hero";
import { WhyPlymouth } from "@/components/WhyPlymouth";
import { PropertyHighlights } from "@/components/PropertyHighlights";
import { RoomShowcase } from "@/components/RoomShowcase";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Experience } from "@/components/Experience";
import { Testimonials } from "@/components/Testimonials";
import { Location } from "@/components/Location";
import { FAQ } from "@/components/FAQ";
import { CTABanner } from "@/components/CTABanner";
import { BookingWidget } from "@/components/BookingWidget";


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Where is The Plymouth Chicago located?", "acceptedAnswer": { "@type": "Answer", "text": "The Plymouth Chicago is located at 417 S Dearborn Street in Chicago's Printer's Row neighborhood, in the heart of the Loop. Walking distance to Millennium Park, the Chicago Riverwalk, and major transit." } },
    { "@type": "Question", "name": "What room types does The Plymouth Chicago offer?", "acceptedAnswer": { "@type": "Answer", "text": "The Plymouth Chicago offers 2-bedroom suites (up to 4 guests), 3-bedroom suites (up to 6 guests), and 4-bedroom suites (up to 10 guests). All suites include full kitchens, private bedrooms, and separate living areas." } },
    { "@type": "Question", "name": "Is The Plymouth Chicago a hotel?", "acceptedAnswer": { "@type": "Answer", "text": "The Plymouth Chicago is a boutique apartment-hotel offering private multi-bedroom suites with full kitchens and separate living spaces — a premium alternative to traditional Chicago Loop hotels, ideal for groups and extended stays." } },
    { "@type": "Question", "name": "Does The Plymouth Chicago have a kitchen?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — every suite at The Plymouth Chicago includes a full kitchen with real appliances, cookware, dishes, and silverware. Perfect for groups who want to cook or store food during their stay." } },
    { "@type": "Question", "name": "How do I check in at The Plymouth Chicago?", "acceptedAnswer": { "@type": "Answer", "text": "The Plymouth Chicago offers smart self check-in via digital key and smart lock. No front desk wait — you can access your suite directly upon arrival." } },
    { "@type": "Question", "name": "Is The Plymouth Chicago good for groups?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — The Plymouth was designed for groups. With 2, 3, and 4-bedroom suites, everyone stays together with private bedrooms and shared living areas, at a fraction of the cost of booking multiple hotel rooms." } },
  ]
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <WhyPlymouth />
      <PropertyHighlights />
      <RoomShowcase />
      <PhotoGallery />
      <Experience />
      <Testimonials />
      <Location />
      <FAQ />
      <BookingWidget />
      <CTABanner />
    </>
  );
}
