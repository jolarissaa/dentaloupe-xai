import { describe, it, expect } from "vitest";

import { overlayDesc, overlayTitle } from "@/lib/overlayLabels";

describe("overlay captions", () => {
  it("translates titles without touching model names", () => {
    expect(overlayTitle("XAI · Caries ICDAS · Lower (occlusal)")).toBe("XAI · Karies ICDAS · Rahang Bawah (oklusal)");
    expect(overlayTitle("Panoramic Caries (hidden)")).toBe("Karies Panoramik (lesi internal)");
    expect(overlayTitle("FDI · Panoramic")).toBe("FDI · Panoramik");
  });

  it("translates descriptions and keeps their numbers and grades", () => {
    expect(overlayDesc("20 teeth detected + 5 interpolated (amber “?”)")).toBe("20 gigi terdeteksi + 5 hasil interpolasi (tanda “?” kuning)");
    expect(overlayDesc("7 lesions · grades D3, D6")).toBe("7 lesi · derajat D3, D6");
    expect(overlayDesc("2 teeth with radiographic caries: 17·D2, 26·D2")).toBe("2 gigi dengan karies radiografis: 17·D2, 26·D2");
  });

  it("leaves unknown text unchanged", () => {
    expect(overlayDesc("Foto pasien")).toBe("Foto pasien");
    expect(overlayTitle("")).toBe("");
  });
});
