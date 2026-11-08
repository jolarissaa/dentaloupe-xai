"use client";
import { useState } from "react";
import { ChevronDown, Crosshair } from "lucide-react";

import { TRIAGE_LEVELS } from "@/lib/report";
import { cn } from "@/lib/utils";
import { Inline, Md } from "./Citations";

/** Colour per urgency level, most urgent first (the narrow top of the pyramid). */
export const TRIAGE_STYLE = {
  Segera: { bar: "bg-rose-600 text-white", soft: "border-rose-200 bg-rose-50", label: "text-rose-700" },
  Cepat: { bar: "bg-orange-500 text-white", soft: "border-orange-200 bg-orange-50", label: "text-orange-700" },
  Terjadwal: { bar: "bg-amber-300 text-amber-950", soft: "border-amber-200 bg-amber-50", label: "text-amber-800" },
  Pemantauan: { bar: "bg-emerald-600 text-white", soft: "border-emerald-200 bg-emerald-50", label: "text-emerald-700" },
};
const WIDTHS = ["w-[58%]", "w-[72%]", "w-[86%]", "w-full"];

const uniq = (a) => [...new Set(a)];

/**
 * The "Prioritas & Triase" section as an urgency pyramid. Each level lists its teeth; the
 * reasoning behind them only opens when the level is tapped, so the first read is just
 * "which teeth, how urgent".
 */
export function TriagePyramid({ data, onShowTooth }) {
  const [open, setOpen] = useState(null);
  const groups = TRIAGE_LEVELS.map((level) => ({ level, items: data.items.filter((i) => i.level === level) }));
  const opened = groups.find((g) => g.level === open);

  return (
    <div className="space-y-4">
      <Md>{data.before}</Md>

      <ul className="flex flex-col items-center gap-1.5" aria-label="Piramida prioritas penanganan">
        {groups.map((g, i) => {
          const teeth = uniq(g.items.flatMap((it) => it.teeth));
          const on = open === g.level;
          const empty = g.items.length === 0;
          return (
            <li key={g.level} className={cn("flex justify-center", WIDTHS[i])}>
              <button
                type="button"
                disabled={empty}
                aria-expanded={on}
                onClick={() => setOpen(on ? null : g.level)}
                className={cn(
                  "flex w-full min-w-0 items-center justify-between gap-2 rounded-xl px-3 py-2 text-left shadow-sm transition-all duration-200",
                  TRIAGE_STYLE[g.level].bar,
                  empty ? "opacity-35" : "hover:brightness-110",
                  on && "ring-2 ring-foreground/50 ring-offset-2 ring-offset-background"
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{g.level}</span>
                  <span className="block truncate text-[11px] opacity-90">
                    {teeth.length ? `Gigi ${teeth.join(", ")}` : "Tidak ada"}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold tabular-nums">
                  {teeth.length}
                  {!empty && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", on && "rotate-180")} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-center text-[11px] text-muted-foreground">Ketuk tingkat prioritas untuk melihat alasannya</p>

      {opened && (
        <div className="space-y-2 animate-fade-in" aria-label={`Alasan prioritas ${opened.level}`}>
          {opened.items.map((it, i) => (
            <article key={i} className={cn("rounded-2xl border p-3.5", TRIAGE_STYLE[opened.level].soft)}>
              <p className={cn("text-xs font-semibold uppercase tracking-wide", TRIAGE_STYLE[opened.level].label)}>
                {opened.level} · {it.label}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/85">
                <Inline text={it.reason} />
              </p>
              {onShowTooth && it.teeth.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {it.teeth.map((fdi) => (
                    <button
                      key={fdi}
                      type="button"
                      onClick={() => onShowTooth(fdi)}
                      className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Crosshair className="h-3 w-3" />
                      Gigi {fdi}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <Md>{data.after}</Md>
    </div>
  );
}
