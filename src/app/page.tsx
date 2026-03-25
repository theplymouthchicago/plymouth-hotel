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

export default function Home() {
  return (
    <>
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
