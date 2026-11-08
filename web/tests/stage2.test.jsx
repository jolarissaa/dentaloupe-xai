import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { parseReport } from "@/lib/report";
import { TriagePyramid } from "@/components/result/report/Triage";
import LlmDiagnosis from "@/components/result/LlmDiagnosis";

const advisory = JSON.parse(
  readFileSync(path.resolve(__dirname, "../public/standalone/advisory.json"), "utf8")
);

const TRIAGE_MD = [
  "# Rekomendasi Penanganan",
  "",
  "## Prioritas & Triase",
  "",
  "1. **Segera — gigi 21 dan 11:** sumber nyeri spontan; fokus ±37% lebar mahkota.",
  "2. **Cepat:** gigi **24** karena D6 dengan rasio 0,507.",
  "3. **Pemantauan — gigi 17:** lesi internal, perlu foto periapikal.",
  "",
  "Catatan penutup.",
].join("\n");

describe("triage", () => {
  it("reads level, teeth and reason from both item styles", () => {
    const s = parseReport(TRIAGE_MD).sections[0];
    expect(s.kind).toBe("triage");
    expect(s.data.items.map((i) => [i.level, i.teeth])).toEqual([
      ["Segera", [21, 11]],
      ["Cepat", [24]],
      ["Pemantauan", [17]],
    ]);
    expect(s.data.after).toBe("Catatan penutup.");
  });

  it("recognises the bundled treatment plan's triage", () => {
    const s = parseReport(advisory.recommendation_md).sections.find((x) => x.kind === "triage");
    expect(s).toBeTruthy();
    expect(s.data.items.length).toBeGreaterThanOrEqual(4);
    expect(s.data.items.every((i) => i.teeth.length > 0)).toBe(true);
  });

  it("shows the reasons only after a level is tapped", async () => {
    const user = userEvent.setup();
    const onShowTooth = vi.fn();
    const { data } = parseReport(TRIAGE_MD).sections[0];
    render(<TriagePyramid data={data} onShowTooth={onShowTooth} />);

    expect(screen.queryByText(/sumber nyeri spontan/)).toBeNull();
    expect(screen.getByRole("button", { name: /Terjadwal/ })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /Segera/ }));
    expect(screen.getByText(/sumber nyeri spontan/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Gigi 11" }));
    expect(onShowTooth).toHaveBeenCalledWith(11);
  });
});

describe("jaw filter", () => {
  const MD = [
    "## Diagnosis per Gigi",
    "",
    "| Gigi | Nama gigi | ICDAS |",
    "| --- | --- | --- |",
    "| 11 | insisivus atas | D6 |",
    "| 36 | molar bawah | D3 |",
    "| 55 | molar sulung atas | D2 |",
  ].join("\n");

  it("shows upper, lower or all teeth", async () => {
    const user = userEvent.setup();
    render(<LlmDiagnosis markdown={MD} />);
    const filter = screen.getByRole("tablist", { name: "Filter rahang" });
    expect(screen.getByText("molar bawah")).toBeInTheDocument();

    await user.click(within(filter).getByRole("tab", { name: "Rahang Atas" }));
    expect(screen.queryByText("molar bawah")).toBeNull();
    expect(screen.getByText("insisivus atas")).toBeInTheDocument();
    expect(screen.getByText("molar sulung atas")).toBeInTheDocument();

    await user.click(within(filter).getByRole("tab", { name: "Rahang Bawah" }));
    expect(screen.getByText("molar bawah")).toBeInTheDocument();
    expect(screen.queryByText("insisivus atas")).toBeNull();
  });
});
