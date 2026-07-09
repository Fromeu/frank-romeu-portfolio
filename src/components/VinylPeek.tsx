// The record itself: a full disc (groove rings, label, spindle hole),
// centered behind the cover art inside the same square box. It's always
// fully rendered — how much is actually *visible* is controlled entirely by
// the sibling <img> sliding away from in front of it (see CrateRecord.tsx /
// RecordCard.tsx / the case-study hero), not by anything in here. Because
// the parent box has `overflow-hidden`, nothing here can ever render outside
// the square — there's no clip-zone math to get right, it's structural.
//
// Stacking: the sibling <img> is `absolute` too (needed so it can slide
// inside the fixed box), so with both this and the image being positioned
// elements with z-index:auto, plain DOM order governs which paints on top —
// this renders first (behind), the <img> after (in front). No z-index hacks
// needed.
//
// On hover of an ancestor `.group`, the disc rotates slightly — the record
// starting to spin as it's uncovered. Framer-motion isn't used here (or for
// the image's slide): this is a hover microinteraction, and the site's
// established convention is plain CSS `group-hover` for those (framer's
// `whileHover` doesn't observe ancestor hover anyway — see `Sticker`).
export default function VinylPeek() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-[35deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
    >
      <svg viewBox="0 0 100 100" className="h-[92%] w-[92%]">
        <circle cx="50" cy="50" r="48" fill="#1a1510" fillOpacity="0.92" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#F8F5EC" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#F8F5EC" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#F8F5EC" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="50" cy="50" r="15" fill="#F8F5EC" fillOpacity="0.92" />
        <circle cx="50" cy="50" r="2.5" fill="#1a1510" />
      </svg>
    </div>
  );
}
