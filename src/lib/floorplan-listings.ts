// Map from floorplan key → all Guesty listing IDs that share that floorplan.
//
// Plymouth has 6 physical units per floorplan (2BR, 3BR, 4BR). The site
// presents each as a single "room type" with one canonical listing for
// photos / amenities, but availability has to aggregate across all 6 units —
// a date isn't really "booked" for the 2BR type unless EVERY 2BR unit is
// booked, since the booking system can still place a guest in any free
// sibling.
//
// Floorplan keys are the slug uppercased ("2BR", "3BR", "4BR"). The first
// ID in each list is the canonical unit used for photos / amenities; the
// others are siblings that can take overflow bookings.
export const FLOORPLAN_LISTINGS: Record<string, string[]> = {
  "2BR": [
    "69b8610659a0a7001528058c", // Plymouth 1101 — canonical
    "69c1bd1878b77900124fa0bc",
    "69c2eede4051c40014406b29",
    "69c5ae86898bb70013d2c9d0",
    "69c5bd70d32c0f0013de5a9c",
    "69c5bdb0272bdf0013622c55",
  ],
  "3BR": [
    "69b863afab91d0002330efdb", // Plymouth 1102 — canonical
    "69c1c0d483895f0016ffe345",
    "69c2f0395c56d500145ed085",
    "69c5af97272bdf00135fd431",
    "69c5bd82184b60001569d420",
    "69c5bdbfe0c8ea0014e4f0f9",
  ],
  "4BR": [
    "69b866a2139149001c905bfa", // Plymouth 1103 — canonical
    "69c1d305dbed970015008257",
    "69c2f133f460340014eab76b",
    "69c5aff0fab0e500138dfec3",
    "69c5bd90c91a6c0013265ccd",
    "69c5bdcd53cb7d00146504cf",
  ],
};

export function floorplanForSlug(slug: string): string | null {
  const key = slug.toUpperCase();
  return FLOORPLAN_LISTINGS[key] ? key : null;
}
