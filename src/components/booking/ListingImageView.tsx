"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface PhotoItem {
  url: string;
  alt: string;
}

interface Props {
  primary: PhotoItem;
  gallery: PhotoItem[];
  variant: "rooms-hero" | "book-sidebar";
}

export function ListingImageView({ primary, gallery, variant }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Build the lightbox slide list: primary first, then gallery (de-dup primary if it appears first).
  const allPhotos: PhotoItem[] = [
    primary,
    ...gallery.filter((g) => g.url !== primary.url),
  ];
  const slides = allPhotos.map((p) => ({ src: p.url, alt: p.alt }));

  const open = (i: number) => setOpenIndex(i);
  const close = () => setOpenIndex(null);

  if (variant === "rooms-hero") {
    return (
      <>
        <button
          type="button"
          onClick={() => open(0)}
          className="relative w-full h-full block group cursor-zoom-in"
          aria-label="View all photos"
        >
          <Image
            src={primary.url}
            alt={primary.alt}
            fill
            className="object-cover transition-opacity group-hover:opacity-95"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
          {gallery.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12 pointer-events-none">
              <div className="flex gap-2 overflow-x-auto pointer-events-auto">
                {gallery.slice(0, 6).map((g, i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      // gallery items follow primary in slides array (deduped)
                      const slideIdx = allPhotos.findIndex((p) => p.url === g.url);
                      open(slideIdx >= 0 ? slideIdx : 0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        const slideIdx = allPhotos.findIndex((p) => p.url === g.url);
                        open(slideIdx >= 0 ? slideIdx : 0);
                      }
                    }}
                    className="relative w-20 h-14 flex-shrink-0 border border-white/30 hover:border-plymouth-gold transition-colors cursor-zoom-in"
                  >
                    <Image src={g.url} alt={g.alt} fill className="object-cover" sizes="80px" unoptimized />
                  </div>
                ))}
                {gallery.length > 6 && (
                  <div className="relative w-20 h-14 flex-shrink-0 border border-white/30 bg-black/60 flex items-center justify-center text-white text-xs uppercase tracking-wider">
                    +{gallery.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </button>
        <Lightbox
          open={openIndex !== null}
          index={openIndex ?? 0}
          close={close}
          slides={slides}
          carousel={{ finite: false, padding: 0 }}
          animation={{ fade: 250, swipe: 300 }}
          styles={{
            container: { backgroundColor: "rgba(10, 10, 10, 0.96)" },
            icon: { color: "#C8A45E" },
          }}
          controller={{ closeOnBackdropClick: true }}
        />
      </>
    );
  }

  // variant === "book-sidebar"
  return (
    <>
      <button
        type="button"
        onClick={() => open(0)}
        className="relative aspect-[4/3] mb-2 block w-full group cursor-zoom-in"
        aria-label="View all photos"
      >
        <Image
          src={primary.url}
          alt={primary.alt}
          fill
          className="object-cover transition-opacity group-hover:opacity-95"
          sizes="400px"
          unoptimized
        />
        {gallery.length > 0 && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] uppercase tracking-[0.2em] px-2 py-1">
            +{gallery.length} photos
          </span>
        )}
      </button>
      {gallery.length > 0 && (
        <div className="grid grid-cols-4 gap-1 mb-6">
          {gallery.slice(0, 4).map((g, i) => {
            const slideIdx = allPhotos.findIndex((p) => p.url === g.url);
            const isLastWithMore = i === 3 && gallery.length > 4;
            return (
              <button
                key={i}
                type="button"
                onClick={() => open(slideIdx >= 0 ? slideIdx : 0)}
                className="relative aspect-square overflow-hidden group cursor-zoom-in"
                aria-label={isLastWithMore ? `View all ${allPhotos.length} photos` : "View photo"}
              >
                <Image
                  src={g.url}
                  alt={g.alt}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-80"
                  sizes="100px"
                  unoptimized
                />
                {isLastWithMore && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-display">
                    +{allPhotos.length - 4}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <Lightbox
        open={openIndex !== null}
        index={openIndex ?? 0}
        close={close}
        slides={slides}
        carousel={{ finite: false, padding: 0 }}
        animation={{ fade: 250, swipe: 300 }}
        styles={{
          container: { backgroundColor: "rgba(10, 10, 10, 0.96)" },
          icon: { color: "#C8A45E" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}
