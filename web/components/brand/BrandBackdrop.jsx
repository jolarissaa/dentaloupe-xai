import { LogoWatermark } from "./Logo";

/**
 * Page ornament behind every screen: abstract, translucent grey pieces of the Dentaloupe mark
 * (a lens ring, the glasses cropped by the edge, a glint), as dr Gilang asked, so the
 * background is not flat white and any screenshot carries the brand. Fixed, decorative,
 * below all content and never interactive.
 */
export default function BrandBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-[hsl(var(--brand-grey))]"
    >
      {/* Lens ring breaking in from the top right. */}
      <svg
        viewBox="0 0 200 200"
        className="dl-drift absolute -right-24 -top-28 h-[340px] w-[340px] opacity-[0.10] sm:-right-16 sm:h-[460px] sm:w-[460px]"
      >
        <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="34" />
        <path d="M58 92a44 44 0 0 1 40-38 36 36 0 0 0-30 50z" fill="currentColor" opacity="0.8" />
      </svg>

      {/* The glasses, cropped by the bottom-left corner. */}
      <div className="dl-drift-slow absolute -bottom-24 -left-28 w-[420px] sm:w-[620px]">
        <LogoWatermark className="h-auto w-full -rotate-12 !text-[hsl(var(--brand-grey))] opacity-[0.08]" />
      </div>

      {/* Small loose ring mid-right, for depth on tall pages. */}
      <svg
        viewBox="0 0 100 100"
        className="dl-drift absolute right-[8%] top-[58%] hidden h-24 w-24 opacity-[0.08] md:block"
      >
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="16" />
      </svg>
    </div>
  );
}
