"use client";

import { useState, useCallback, type ReactNode } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface PhotoItem {
  url: string;
  alt: string;
}

interface Props {
  photos: PhotoItem[];
  children: (open: (index: number) => void) => ReactNode;
}

export function PhotoLightbox({ photos, children }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setOpenIndex(index), []);
  const close = useCallback(() => setOpenIndex(null), []);

  const slides = photos.map((p) => ({ src: p.url, alt: p.alt }));

  return (
    <>
      {children(open)}
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
          button: { filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}
