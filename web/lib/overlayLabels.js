/**
 * Indonesian display text for overlay captions.
 *
 * The vision pipeline writes the captions in overlays.json in English, for the bundled datasets
 * and for real cases alike. The app defaults to Indonesian, so they are translated when shown.
 * Anything not recognised is shown unchanged.
 */

const TITLE_TERMS = [
  ["Panoramic Caries (hidden)", "Karies Panoramik (lesi internal)"],
  ["Panoramic Caries", "Karies Panoramik"],
  ["Caries ICDAS", "Karies ICDAS"],
  ["Segmentation", "Segmentasi"],
  ["Lower (occlusal)", "Rahang Bawah (oklusal)"],
  ["Upper (occlusal)", "Rahang Atas (oklusal)"],
  ["Side Left", "Samping Kiri"],
  ["Side Right", "Samping Kanan"],
  ["Front", "Tampak Depan"],
  ["Panoramic", "Panoramik"],
];

const DESC_PATTERNS = [
  [/^(\d+) teeth detected \+ (\d+) interpolated \(amber .?\?.?\)$/, "$1 gigi terdeteksi + $2 hasil interpolasi (tanda “?” kuning)"],
  [/^(\d+) teeth, (\d+) caries polygons$/, "$1 gigi, $2 area karies"],
  [/^(\d+) lesions · grades (.+)$/, "$1 lesi · derajat $2"],
  [/^(\d+) teeth numbered on the panoramic$/, "$1 gigi bernomor pada panoramik"],
  [/^(\d+) teeth with radiographic caries: (.+)$/, "$1 gigi dengan karies radiografis: $2"],
  [/^where the tooth detector focuses \(deep feature energy\)$/, "area yang menjadi fokus model deteksi gigi"],
  [/^attention of the tooth\/caries segmenter$/, "area yang menjadi fokus model segmentasi gigi/karies"],
  [/^backbone feature energy driving the grade boxes$/, "area yang memengaruhi penentuan derajat karies"],
  [/^where the panoramic tooth numberer attends$/, "area yang menjadi fokus penomoran gigi panoramik"],
  [/^caries probability heatmap \(pre-threshold\)$/, "peta panas probabilitas karies (sebelum ambang batas)"],
];

export function overlayTitle(title = "") {
  return TITLE_TERMS.reduce((text, [en, id]) => text.split(en).join(id), title);
}

export function overlayDesc(desc = "") {
  for (const [pattern, id] of DESC_PATTERNS) {
    if (pattern.test(desc)) return desc.replace(pattern, id);
  }
  return desc;
}
