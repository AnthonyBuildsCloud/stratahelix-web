"use client";

import {
  useState,
  FormEvent,
  ChangeEvent,
  useMemo,
} from "react";
import { useSearchParams } from "next/navigation";

type PackageId = "snapshot" | "core" | "methylation-plus" | "elite";

const PACKAGES: {
  id: PackageId;
  name: string;
  price: string;
  blurb: string;
}[] = [
  {
    id: "snapshot",
    name: "Snapshot",
    price: "$0",
    blurb: "Free mini report to preview how StrataHelix interprets your DNA.",
  },
  {
    id: "core",
    name: "Core",
    price: "$89",
    blurb: "Full baseline DNA wellness report with action steps.",
  },
  {
    id: "methylation-plus",
    name: "Methylation+ Performance",
    price: "$149",
    blurb: "Deeper methylation, performance, and supplement strategy.",
  },
  {
    id: "elite",
    name: "Elite",
    price: "$219",
    blurb: "Full-stack blueprint with recovery, cardio-metabolic and stack layouts.",
  },
];

/**
 * Which SNPs each package cares about.
 * These are examples – you can expand or tweak this list over time.
 */
const PACKAGE_MARKERS: Record<PackageId, string[]> = {
  snapshot: [
    "rs9939609", // FTO – appetite / weight tendency
    "rs1815739", // ACTN3 – power vs endurance
    "rs762551", // CYP1A2 – caffeine
  ],
  core: [
    "rs9939609",
    "rs1815739",
    "rs762551",
    "rs4994", // ADRB3 – fat burning tendency
    "rs662", // PON1 – detox/oxidative stress
    "rs8192678", // PPARGC1A – mitochondrial endurance
  ],
  "methylation-plus": [
    "rs1801133", // MTHFR C677T
    "rs1801131", // MTHFR A1298C
    "rs4680", // COMT
    "rs6265", // BDNF
    "rs9939609",
    "rs1815739",
  ],
  elite: [
    // Everything above plus more “premium” coverage
    "rs9939609",
    "rs1815739",
    "rs762551",
    "rs4994",
    "rs662",
    "rs8192678",
    "rs1801133",
    "rs1801131",
    "rs4680",
    "rs6265",
    "rs429358", // APOE
    "rs7412", // APOE
  ],
};

type UploadStatus =
  | null
  | "idle"
  | "parsing"
  | "sending"
  | "done"
  | "error";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const pkgFromQuery = searchParams.get("pkg") as PackageId | null;

  const [selectedPkg, setSelectedPkg] = useState<PackageId>(
    pkgFromQuery &&
      (["snapshot", "core", "methylation-plus", "elite"] as const).includes(
        pkgFromQuery
      )
      ? pkgFromQuery
      : "snapshot"
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusKind, setStatusKind] = useState<UploadStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);

  const selectedPackageLabel = useMemo(
    () => PACKAGES.find((p) => p.id === selectedPkg)?.name ?? selectedPkg,
    [selectedPkg]
  );

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const newFile = e.target.files?.[0] ?? null;
    setFile(newFile);
    setReportText(null);
    setStatusKind("idle");

    if (!newFile) {
      setFileName(null);
      setStatusText(null);
      return;
    }

    setFileName(newFile.name);
    setStatusText(
      `File selected: ${newFile.name} (${(newFile.size / 1024 / 1024).toFixed(
        2
      )} MB).`
    );
  }

  /**
   * Parse the full raw DNA file in the browser and extract only
   * the SNPs needed for the currently selected package.
   */
  async function extractMarkersForPackage(
    file: File,
    pkg: PackageId
  ): Promise<{
    markers: Record<string, string>;
    totalLines: number;
  }> {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const allUserMarkers: Record<string, string> = {};

    for (const line of lines) {
      if (!line || line.startsWith("#")) continue;

      // handle tab or comma or mixed whitespace
      const parts = line.split(/[\t, ]+/).filter(Boolean);
      if (parts.length < 4) continue;

      const rsid = parts[0];
      const genotype = parts[3];

      if (!rsid || !genotype) continue;
      allUserMarkers[rsid] = genotype;
    }

    const neededRsids = PACKAGE_MARKERS[pkg] ?? [];
    const filtered: Record<string, string> = {};

    for (const rsid of neededRsids) {
      if (allUserMarkers[rsid]) {
        filtered[rsid] = allUserMarkers[rsid];
      }
    }

    return {
      markers: filtered,
      totalLines: lines.length,
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file) {
      setStatusKind("error");
      setStatusText("Please choose a raw DNA file before continuing.");
      return;
    }

    setIsSubmitting(true);
    setStatusKind("parsing");
    setReportText(null);
    setStatusText(
      `Reading your DNA file and extracting markers for the ${selectedPackageLabel} package...`
    );

    try {
      const { markers, totalLines } = await extractMarkersForPackage(
        file,
        selectedPkg
      );

      const markerCount = Object.keys(markers).length;

      if (markerCount === 0) {
        setStatusKind("error");
        setStatusText(
          "We couldn’t find any of the SNP markers this package uses in your file. Try a different provider file or package."
        );
        return;
      }

      setStatusKind("sending");
      setStatusText(
        `Found ${markerCount} relevant markers out of ${totalLines} lines. Sending them securely to StrataHelix AI for report generation...`
      );

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pkg: selectedPkg,
          fileName: file.name,
          fileSizeBytes: file.size,
          markers,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload error:", errorText);
        setStatusKind("error");
        setStatusText(
          "Upload or report generation failed. Please try again in a moment."
        );
        return;
      }

      const data = await res.json();

      setReportText(data.report ?? null);
      setStatusKind("done");
      setStatusText(
        `Upload and AI report generation complete. Parsed ${totalLines} lines and used ${data.markersUsedCount ?? markerCount} markers for this tier.`
      );
    } catch (error) {
      console.error("Client upload error:", error);
      setStatusKind("error");
      setStatusText(
        "Something went wrong while processing your file. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyReport() {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText).catch((err) => {
      console.error("Copy failed:", err);
    });
  }

  function handleDownloadReport() {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stratahelix-${selectedPkg}-report.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const statusColorClass =
    statusKind === "error"
      ? "text-[#FCA5A5]"
      : statusKind === "done"
      ? "text-[#27E0C0]"
      : "text-[#9CA3AF]";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
      {/* HEADER */}
      <section className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Upload your raw DNA and choose your StrataHelix report.
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          We currently support raw DNA files from major platforms such as
          23andMe and AncestryDNA. You&apos;ll upload your file once, select a
          report tier, and we&apos;ll use AI to generate a non-medical wellness
          report focused on metabolism, training, recovery, sleep, methylation,
          and supplement strategy.
        </p>
        <p className="text-[11px] text-[#6B7280]">
          Educational only. Not a medical service. No diagnoses, no disease risk
          predictions.
        </p>
      </section>

      {/* LAYOUT: left = form, right = packages */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        {/* LEFT: FILE + SUMMARY + REPORT PREVIEW */}
        <div className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-[#1F2933] bg-[#020617] p-6"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Step 1 · Upload DNA
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                Download your raw DNA file from your provider (23andMe,
                AncestryDNA, etc.) and upload it here. We don&apos;t accept
                screenshots or PDF summaries—only the raw text file.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#D1D5DB]">
                Raw DNA file
              </label>
              <label className="flex cursor-pointer flex-col items-start justify-center gap-2 rounded-lg border border-dashed border-[#374151] bg-[#020617] px-4 py-5 text-xs text-[#9CA3AF] hover:border-[#27E0C0]/60 hover:bg-[#020617]">
                <span className="font-medium text-[#F9FAFB]">
                  {fileName ? "File selected" : "Click to choose file"}
                </span>
                <span className="text-[11px]">
                  Accepted: raw DNA text files from 23andMe, AncestryDNA, and
                  similar platforms (usually <code>.txt</code>).
                </span>
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileName && (
                <p className="text-[11px] text-[#27E0C0]">
                  Selected: <span className="font-medium">{fileName}</span>
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold tracking-tight">
                Step 2 · Confirm report tier
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                You&apos;ve currently selected:{" "}
                <span className="font-semibold text-[#F9FAFB]">
                  {selectedPackageLabel}
                </span>{" "}
                (
                {PACKAGES.find((p) => p.id === selectedPkg)?.price ??
                  "one-time"}
                ). You can change this on the right before submitting.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing DNA & generating report..."
                : "Continue with this file & tier"}
            </button>

            {statusText && (
              <p className={`mt-3 text-[11px] ${statusColorClass}`}>
                {statusText}
              </p>
            )}
          </form>

          {/* AI REPORT PREVIEW */}
          {reportText && (
            <div className="space-y-3 rounded-xl border border-[#1F2933] bg-[#020617] p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">
                    AI-generated draft report (developer preview)
                  </h3>
                  <p className="text-[11px] text-[#9CA3AF]">
                    This is the raw text returned from the StrataHelix AI
                    backend. In the real product, this will be rendered as a
                    polished report or PDF.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="rounded-md border border-[#374151] px-3 py-1.5 text-[11px] text-[#F9FAFB] hover:border-[#27E0C0]/70"
                  >
                    Copy report
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="rounded-md bg-[#27E0C0] px-3 py-1.5 text-[11px] font-medium text-[#020617] hover:opacity-90"
                  >
                    Download .txt
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={reportText}
                className="mt-3 h-64 w-full resize-none rounded-md border border-[#111827] bg-[#020617] p-3 text-xs text-[#E5E7EB]"
              />
            </div>
          )}
        </div>

        {/* RIGHT: PACKAGE SELECTOR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Choose your report
            </h2>
            <span className="text-[11px] text-[#6B7280]">
              You can start free and upgrade later.
            </span>
          </div>

          <div className="space-y-3">
            {PACKAGES.map((pkg) => {
              const isSelected = pkg.id === selectedPkg;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPkg(pkg.id);
                    setStatusKind("idle");
                    setStatusText(
                      `Selected ${pkg.name}. Upload or re-use your DNA file and generate a ${pkg.name} report.`
                    );
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-xs transition ${
                    isSelected
                      ? "border-[#27E0C0] bg-[#020617] shadow-[0_0_0_1px_rgba(39,224,192,0.3)]"
                      : "border-[#1F2933] bg-[#020617] hover:border-[#27E0C0]/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#F9FAFB]">
                        {pkg.name}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {pkg.blurb}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#F9FAFB]">
                        {pkg.price}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {pkg.id === "snapshot" ? "Browser report" : "One-time"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-[#6B7280]">
            In the production version, this page will connect your chosen
            package to a secure Stripe checkout (for paid tiers) and then
            trigger report generation once your file is validated.
          </p>
        </div>
      </section>
    </div>
  );
}
