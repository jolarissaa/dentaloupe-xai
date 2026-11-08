"use client";
import { useEffect, useMemo, useState } from "react";

import { mediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import ModelGallery from "./ModelGallery";

/**
 * "Foto Pasien" — the patient's uploaded intraoral views + panoramic, shown as a
 * horizontal slider with the same card + zoom/pan lightbox as ModelGallery.
 *
 * Two sources, in priority order:
 *   1. `images` — the case's real uploads (served from the gateway's authenticated `/media`
 *      mount, so the URL is built by `mediaUrl` which attaches the session token).
 *   2. `base + "inputs.json"` — the dataset's bundled source photos (demos / offline),
 *      served statically from the frontend origin alongside overlays.
 */
const VIEW_LABELS = {
  front: "Tampak Depan",
  side_left: "Samping Kiri",
  side_right: "Samping Kanan",
  up: "Rahang Atas (oklusal)",
  bottom: "Rahang Bawah (oklusal)",
  panoramic: "Panoramik",
};
/** Overlay ids (overlays.json) holding the ICDAS boxes and their attention heatmap, per view. */
const OVERLAY_ID = {
  box: (v) => (v === "panoramic" ? "panoramic_caries" : `${v}_grade`),
  heat: (v) => (v === "panoramic" ? "xai_panoramic_caries" : `xai_${v}_grade`),
};
const MODES = [
  ["photo", "Foto Asli", "Foto pasien"],
  ["box", "Box Deteksi", "Kotak deteksi karies (ICDAS)"],
  ["heat", "Heatmap", "Peta panas atensi AI"],
];

const ORDER = ["front", "side_left", "side_right", "up", "bottom", "panoramic"];
const rank = (vk) => (ORDER.indexOf(vk) < 0 ? ORDER.length : ORDER.indexOf(vk));

export default function PatientPhotos({ images, base }) {
  const [items, setItems] = useState(null);
  const [overlays, setOverlays] = useState({});
  const [mode, setMode] = useState("photo");

  // The case's overlay renders, to swap each photo for its boxes or heatmap.
  useEffect(() => {
    if (!base) return;
    let alive = true;
    fetch(base + "overlays/overlays.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!alive) return;
        const map = {};
        for (const it of list || []) {
          if (!it?.id || !it.src) continue;
          map[it.id] = it.src.startsWith("http") || it.src.startsWith("/") ? it.src : base + it.src;
        }
        setOverlays(map);
      })
      .catch(() => alive && setOverlays({}));
    return () => {
      alive = false;
    };
  }, [base]);

  useEffect(() => {
    let alive = true;

    // 1) real uploads on the case
    if (images && images.length) {
      const built = [...images]
        .sort((a, b) => rank(a.view_key) - rank(b.view_key))
        .map((im) => ({
          id: `photo-${im.view_key}`,
          view: im.view_key,
          title: VIEW_LABELS[im.view_key] || im.view_key,
          desc: "Foto pasien",
          src: mediaUrl(im.url),
        }));
      setItems(built);
      return;
    }

    // 2) dataset bundled photos
    if (!base) {
      setItems([]);
      return;
    }
    fetch(base + "inputs.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!alive) return;
        setItems(
          (list || [])
            .slice()
            .sort((a, b) => rank(a.view_key) - rank(b.view_key))
            .map((it) => ({
              id: `photo-${it.view_key}`,
              view: it.view_key,
              title: VIEW_LABELS[it.view_key] || it.label || it.view_key,
              desc: "Foto pasien",
              src: base + "inputs/" + it.file,
            }))
        );
      })
      .catch(() => alive && setItems([]));

    return () => {
      alive = false;
    };
  }, [images, base]);

  const shown = useMemo(() => {
    if (!items || mode === "photo") return items;
    const desc = MODES.find(([k]) => k === mode)[2];
    return items.map((it) => {
      const src = overlays[OVERLAY_ID[mode](it.view)];
      return src ? { ...it, id: `${it.id}-${mode}`, src, desc } : it;
    });
  }, [items, mode, overlays]);

  if (!items || !items.length) return null;
  const canOverlay = items.some((it) => overlays[OVERLAY_ID.box(it.view)] || overlays[OVERLAY_ID.heat(it.view)]);
  return (
    <div className="space-y-2">
      {canOverlay && (
        <div className="inline-flex rounded-full bg-muted p-0.5" role="tablist" aria-label="Tampilan foto pasien">
          {MODES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                mode === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <ModelGallery title="Foto Pasien" ariaLabel="Foto pasien" items={shown} />
    </div>
  );
}
