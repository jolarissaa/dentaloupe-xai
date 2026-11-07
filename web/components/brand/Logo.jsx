import { useId } from "react";

import { cn } from "@/lib/utils";

/** Tooth silhouette (crown + two roots) on a 64-unit grid. Shared with the analysis loader. */
export const TOOTH_PATH =
  "M22 11C15.6 11 11.5 15.6 11.5 22.2c0 5.6 2.3 9 3.8 13.4 1.8 5.4 2 15.4 7.4 15.4 4.3 0 4.5-7.6 6-11.5.8-2.1 1.9-2.9 3.3-2.9s2.5.8 3.3 2.9c1.5 3.9 1.7 11.5 6 11.5 5.4 0 5.6-10 7.4-15.4 1.5-4.4 3.8-7.8 3.8-13.4C52.5 15.6 48.4 11 42 11c-4 0-6.3 1.9-10 1.9S26 11 22 11Z";

/**
 * PLACEHOLDER Dentaloupe-XAI mark: a tooth seen through a loupe on a navy tile. To be replaced
 * once the final logo is ready; the colours follow the palette in app/globals.css.
 *
 * `animated` pops the tile and lens in and draws the tooth, used on the sign-in screen. Motion
 * is dropped entirely under `prefers-reduced-motion`.
 */
export function LogoMark({ className, animated = false, title = "Dentaloupe-XAI" }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("tf-logo shrink-0", animated && "tf-logo--animated", className)}
    >
      <defs>
        <linearGradient id={`tile-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17427A" />
          <stop offset="1" stopColor="#0A2342" />
        </linearGradient>
      </defs>
      <rect className="tf-logo-tile" width="64" height="64" rx="17" fill={`url(#tile-${gid})`} />
      <g transform="translate(28 28) scale(0.56) translate(-32 -31)">
        <path
          className="tf-logo-tooth"
          d={TOOTH_PATH}
          pathLength="1"
          fill="#fff"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </g>
      <g className="tf-logo-lens" fill="none" stroke="#3DD6A8" strokeLinecap="round">
        <circle cx="28" cy="28" r="18" strokeWidth="4" />
        <path d="M41.5 41.5 53 53" strokeWidth="6" />
      </g>
    </svg>
  );
}

/** Mark + wordmark, for page headers. */
export function Logo({ className, markClassName, animated = false }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark animated={animated} className={cn("h-8 w-8", markClassName)} />
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-semibold tracking-tight">
          Dentaloupe<span className="text-[hsl(var(--brand-green))]">-XAI</span>
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">by NAIA</span>
      </span>
    </span>
  );
}
