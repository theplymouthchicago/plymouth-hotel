import { getListingDescription } from "@/lib/listing-description";

// Renders the Guesty publicDescription block in the same section order as
// the Guesty-hosted property page: Description, The Space, Guest Access,
// Neighborhood, Interaction, Getting Around, Other things to note, House
// Rules. Used on both /rooms/[slug] (suite detail) and /book/[type]
// (booking confirmation) so the guest sees the same narrative at every
// step of the funnel.

interface Props {
  listingId: string;
  /**
   * Heading style — "display" matches /rooms/[slug] (large serif headings),
   * "compact" matches the tighter /book/[type] layout where descriptions
   * appear between the amenity card and the booking form.
   */
  variant?: "display" | "compact";
}

export async function ListingLongDescription({ listingId, variant = "display" }: Props) {
  const desc = await getListingDescription(listingId);
  const isCompact = variant === "compact";

  const sections: { title: string; text?: string }[] = [
    { title: "Description", text: desc.summary },
    { title: "The Space", text: desc.space },
    { title: "Guest Access", text: desc.access },
    { title: "Neighborhood", text: desc.neighborhood },
    { title: "Interaction", text: desc.interactionWithGuests },
    { title: "Getting Around", text: desc.transit },
    { title: "Other things to note", text: desc.notes },
    { title: "House Rules", text: desc.houseRules },
  ].filter((s) => !!s.text);

  if (sections.length === 0) return null;

  const headingClass = isCompact
    ? "font-display text-xl text-plymouth-black mb-3"
    : "font-display text-2xl text-plymouth-black mb-4";
  const sectionSpacing = isCompact ? "space-y-8" : "space-y-12";

  return (
    <div className={sectionSpacing}>
      {sections.map((s) => (
        <section key={s.title}>
          <h2 className={headingClass}>{s.title}</h2>
          <div className="text-plymouth-charcoal leading-relaxed space-y-4 text-[15px]">
            <BodyText text={s.text!} />
          </div>
        </section>
      ))}
    </div>
  );
}

// Guesty publicDescription fields are plain text with paragraph breaks via
// blank lines. Render each paragraph as its own <p> and preserve single
// newlines inside a paragraph as visual breaks.
function BodyText({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </>
  );
}
