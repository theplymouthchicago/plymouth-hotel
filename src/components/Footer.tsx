import Link from "next/link";
import Image from "next/image";

const GOOGLE_REVIEW_URL = "https://g.page/r/CeER0GaWiYMCEAE/review";

const footerLinks = {
  Hotel: [
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Experience", href: "/experience" },
    { label: "Location", href: "/location" },
    { label: "FAQ", href: "/faq" },
  ],
  Connect: [
    { label: "Email Us", href: "mailto:info@theplymouthchicago.com" },
    { label: "Call (708) 866-0029", href: "tel:+17088660029" },
    { label: "Leave a Google Review", href: GOOGLE_REVIEW_URL, external: true },
    { label: "417 S Dearborn, Chicago", href: "https://maps.google.com/?q=417+S+Dearborn+St+Chicago+IL+60605", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="bg-plymouth-forest-deep section-padding pt-section pb-12">
      <div className="max-w-container-lg mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/brand/plymouth-mark.png"
                alt="The Plymouth Chicago"
                width={120}
                height={120}
                className="h-14 w-auto"
              />
              <span className="font-display text-2xl text-plymouth-cream tracking-[0.12em] uppercase leading-tight">
                The Plymouth
              </span>
            </Link>
            <p className="text-plymouth-cream/60 text-sm leading-relaxed mt-5 max-w-xs">
              Design-forward suites in the heart of Chicago. Built for groups,
              extended stays, and guests who know the difference.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/plymouthchicago/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-plymouth-cream/20 text-plymouth-cream/60 hover:text-plymouth-brass hover:border-plymouth-brass transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://maps.google.com/?q=417+S+Dearborn+St+Chicago+IL+60605"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-plymouth-cream/20 text-plymouth-cream/60 hover:text-plymouth-brass hover:border-plymouth-brass transition-colors"
                aria-label="View on Google Maps"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>
              </a>
              <a
                href="https://g.page/r/CeER0GaWiYMCEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-plymouth-cream/20 text-plymouth-cream/60 hover:text-plymouth-brass hover:border-plymouth-brass transition-colors"
                aria-label="Leave a Google review"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-plymouth-cream font-body text-sm uppercase tracking-wider mb-6">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  const isMailOrTel = link.href.startsWith("mailto:") || link.href.startsWith("tel:");
                  if (isExternal || isMailOrTel) {
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-plymouth-cream/60 text-sm hover:text-plymouth-brass transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-plymouth-cream/60 text-sm hover:text-plymouth-brass transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-plymouth-dark flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-plymouth-cream/60 text-xs">
            &copy; {new Date().getFullYear()} The Plymouth Hotel. All rights reserved.
          </p>
          <p className="text-plymouth-cream/60 text-xs">
            Chicago, Illinois
          </p>
        </div>
      </div>
    </footer>
  );
}
