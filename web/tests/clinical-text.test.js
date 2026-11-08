import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

import { humanizeClinicalText } from "@/lib/clinicalText";
import { parseReport } from "@/lib/report";

const advisory = JSON.parse(
  readFileSync(path.resolve(__dirname, "../public/standalone/advisory.json"), "utf8")
);

describe("clinical text house style", () => {
  it("turns ratios and decimal percentages into whole percentages", () => {
    expect(humanizeClinicalText("rasio karies 0,45 dan kegelapan 0,064")).toBe("rasio karies 45% dan kegelapan 6%");
    expect(humanizeClinicalText("radiolusensi ±11,8% area gigi")).toBe("radiolusensi ±12% area gigi");
    expect(humanizeClinicalText("fokus ±37% lebar mahkota")).toBe("fokus ±37% lebar mahkota");
  });

  it("keeps ICD-10 codes and grades", () => {
    expect(humanizeClinicalText("K02.1 dan K04.0, derajat D6")).toBe("K02.1 dan K04.0, derajat D6");
  });

  it("replaces semicolons with sentences", () => {
    expect(humanizeClinicalText("dentin luas; pola ini kuat;")).toBe("dentin luas. Pola ini kuat.");
    expect(humanizeClinicalText("D2; **gigi 17** tersembunyi")).toBe("D2. **Gigi 17** tersembunyi");
  });

  it("leaves no decimal ratio or semicolon in the bundled documents, but keeps source quotes verbatim", () => {
    for (const md of [advisory.diagnosis_md, advisory.recommendation_md]) {
      const r = parseReport(md);
      const text = JSON.stringify(r.sections.filter((s) => s.kind !== "sources").map((s) => s.body)) + r.intro;
      expect(text).not.toMatch(/(?<![\w.,])\d+,\d+/);
      expect(text).not.toContain(";");
      const raw = md.split("\n").filter((l) => /^\s{2,}>/.test(l)).map((l) => l.trim().replace(/^>\s?/, ""));
      expect(r.sources.flatMap((s) => s.quotes)).toEqual(raw);
    }
    expect(JSON.stringify(parseReport(advisory.diagnosis_md).sections)).toContain("K02.1");
  });
});
