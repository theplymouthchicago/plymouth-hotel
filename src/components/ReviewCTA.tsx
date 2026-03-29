export function ReviewCTA() {
  return (
    <section className="bg-plymouth-black py-16 border-t border-plymouth-gold/20">
      <div className="max-w-3xl mx-auto text-center px-6">
        <p className="text-plymouth-gold text-xs tracking-[0.2em] uppercase font-medium mb-4">
          Guest Reviews
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-plymouth-offwhite mb-4">
          Loved Your Stay?
        </h2>
        <p className="text-plymouth-charcoal text-lg max-w-xl mx-auto mb-8">
          Share your experience at The Plymouth Chicago and help other guests find their perfect suite.
        </p>
        <a
          href="https://g.page/r/CeER0GaWiYMCEAE/review"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-plymouth-gold text-black px-8 py-3 text-sm tracking-widest uppercase font-medium hover:bg-opacity-90 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Leave a Google Review
        </a>
      </div>
    </section>
  );
}
