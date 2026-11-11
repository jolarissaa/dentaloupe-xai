import { useId } from "react";

import { cn } from "@/lib/utils";
import {
  LENS_LEFT,
  LENS_R,
  LENS_RIGHT,
  MARK_GLINT,
  MARK_NAVY,
  MARK_VIEWBOX,
  WORD_GREY,
  WORD_NAVY,
  WORD_VIEWBOX,
} from "./logoPaths";

const LENSES = [LENS_LEFT, LENS_RIGHT];

/**
 * The Dentaloupe "dp" monogram: a pair of loupe glasses.
 *
 * Motion says what the app is doing rather than decorating it (all of it is dropped under
 * `prefers-reduced-motion`, see app/globals.css):
 *   - `intro`  — the glasses come into focus and the glints settle into the lenses (sign-in).
 *   - `idle`   — a light gleam runs along the frame now and then, and on hover.
 *   - `scan`   — the glints circle inside the lenses while an analysis is running.
 * `tone="mono"` draws everything in one colour (currentColor) for watermarks and dark tiles.
 */
export function LogoMark({ className, motion = "idle", tone = "brand", title = "Dentaloupe-XAI" }) {
  const id = useId().replace(/:/g, "");
  const mono = tone === "mono";
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn("dl-mark shrink-0", `dl-mark--${motion}`, className)}
    >
      <defs>
        <clipPath id={`frame-${id}`}>
          <path d={MARK_NAVY} fillRule="evenodd" clipRule="evenodd" />
        </clipPath>
        {LENSES.map(([cx, cy], i) => (
          <clipPath key={i} id={`lens${i}-${id}`}>
            <circle cx={cx} cy={cy} r={LENS_R} />
          </clipPath>
        ))}
        <linearGradient id={`gleam-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="dl-mark-body">
        <path
          d={MARK_NAVY}
          fillRule="evenodd"
          fill={mono ? "currentColor" : "hsl(var(--brand-navy))"}
        />
        {/* A soft band of light travelling along the frame. */}
        {!mono && (
          <g clipPath={`url(#frame-${id})`}>
            <rect
              className="dl-mark-gleam"
              x="-160"
              y="0"
              width="120"
              height="320"
              fill={`url(#gleam-${id})`}
              transform="skewX(-20)"
            />
          </g>
        )}
      </g>

      {LENSES.map(([cx, cy], i) => (
        <g key={i} clipPath={`url(#lens${i}-${id})`}>
          {/* Faint glass, only visible while scanning. */}
          <circle className="dl-mark-glass" cx={cx} cy={cy} r={LENS_R} />
          <g className={`dl-mark-glint dl-mark-glint-${i}`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <path
              d={MARK_GLINT}
              fillRule="evenodd"
              fill={mono ? "currentColor" : "hsl(var(--brand-grey))"}
              opacity={mono ? 0.55 : 1}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** "dentaloupe" set in the logo's own lettering. */
export function Wordmark({ className, tone = "brand", title = "Dentaloupe" }) {
  const mono = tone === "mono";
  return (
    <svg viewBox={WORD_VIEWBOX} role="img" aria-label={title} className={cn("dl-word shrink-0", className)}>
      <path d={WORD_NAVY} fillRule="evenodd" fill={mono ? "currentColor" : "hsl(var(--brand-navy))"} />
      <path d={WORD_GREY} fillRule="evenodd" fill={mono ? "currentColor" : "hsl(var(--brand-grey))"} opacity={mono ? 0.6 : 1} />
    </svg>
  );
}

/** Mark + wordmark, for page headers. */
export function Logo({ className, markClassName, motion = "idle" }) {
  return (
    <span className={cn("dl-logo group inline-flex items-center gap-2.5", className)}>
      <LogoMark motion={motion} className={cn("h-8 w-auto", markClassName)} title="" />
      <span className="flex flex-col gap-[3px] leading-none">
        <Wordmark className="h-[15px] w-auto" title="Dentaloupe-XAI" />
        <span className="text-[9.5px] font-medium tracking-wide text-muted-foreground">
          <span className="font-semibold text-[hsl(var(--brand-navy))]">XAI</span> · by NAIA
        </span>
      </span>
    </span>
  );
}

/**
 * The mark as a faint silhouette behind content (dr Gilang: copies and screenshots of the
 * white pages should carry the brand). Purely decorative, never intercepts a tap.
 */
export function LogoWatermark({ className }) {
  return (
    <LogoMark
      tone="mono"
      motion="static"
      title=""
      className={cn("pointer-events-none select-none text-[hsl(var(--brand-navy))]", className)}
    />
  );
}
