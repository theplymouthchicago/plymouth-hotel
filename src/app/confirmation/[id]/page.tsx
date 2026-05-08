import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function ConfirmationPage({ params }: Props) {
  return (
    <main className="bg-plymouth-cream min-h-screen pt-32 pb-20 section-padding">
      <div className="max-w-2xl mx-auto text-center bg-white p-12 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-plymouth-gold mx-auto mb-6 flex items-center justify-center text-plymouth-black text-2xl">
          ✓
        </div>
        <p className="text-plymouth-gold text-xs uppercase tracking-[0.3em] mb-4">Booking confirmed</p>
        <h1 className="font-display text-display-lg text-plymouth-black mb-6">
          Thank you. You&apos;re booked.
        </h1>
        <p className="text-plymouth-charcoal text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          A confirmation email is on its way to your inbox. We&apos;ll send your check-in instructions and digital key 24 hours before arrival.
        </p>

        <div className="border border-plymouth-gold/30 p-6 mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-plymouth-gray mb-2">Reservation</p>
          <p className="font-display text-lg text-plymouth-black break-all">{params.id}</p>
        </div>

        <p className="text-sm text-plymouth-gray mb-8">
          Free cancellation up to 48 hours before check-in. Cancellations within 48 hours forfeit the first night&apos;s rate.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-plymouth-black text-white px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-plymouth-charcoal"
          >
            Return home
          </Link>
          <a
            href="tel:+17088660029"
            className="inline-block border border-plymouth-black text-plymouth-black px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-plymouth-black hover:text-white transition-colors"
          >
            (708) 866-0029
          </a>
        </div>
      </div>
    </main>
  );
}
