"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

type PackageId = "snapshot" | "core" | "methylation-plus" | "elite";

type StoredReport = {
  id: string;
  createdAt: string;
  packageId: PackageId;
  tierLabel: string;
  fileName: string;
  report: string;
};

// Stripe Payment Links for paid tiers
const STRIPE_PAYMENT_LINKS: Partial<Record<PackageId, string>> = {
  core: "https://buy.stripe.com/test_9B6bJ1gc37gLeIS0EI6Na00",
  "methylation-plus": "https://buy.stripe.com/test_bJecN55xp58DeISevy6Na01",
  elite: "https://buy.stripe.com/test_6oU9ATf7Z9oT1W69be6Na02",
  // snapshot is free, so no Stripe link
};

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

const LOCAL_STORAGE_KEY = "stratahelix_reports_v1";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const pkgFromQuery = searchParams.get("pkg") as PackageId | null;
  const paidParam = searchParams.get("paid");

  const [selectedPkg, setSelectedPkg] = useState<PackageId>(
    pkgFromQuery &&
      (["snapshot", "core", "methylation-plus", "elite"] as const).includes(
        pkgFromQuery
      )
      ? pkgFromQuery
      : "snapshot"
  );

  // paidMode = came from /success with ?paid=1
  const paidMode =
    paidParam === "1" || paidParam === "true" || paidParam === "yes";

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  function handleCopyReport() {
    if (!report) return;
    try {
      navigator.clipboard.writeText(report);
      setStatus("Report copied to clipboard.");
    } catch (err) {
      console.error("Copy failed:", err);
      setStatus("Could not copy report. Please try manually.");
    }
  }

  function handleDownloadReport() {
    if (!report) return;

    const fileNameSafePkg = selectedPkg.replace(/[^a-z0-9\-]+/gi, "-");
    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stratahelix-${fileNameSafePkg}-report.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setStatus("Report downloaded as a .txt file.");
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFileName(f?.name ?? null);
    setStatus(null);
    setReport(null);
  }

  function saveReportToLocalStorage(args: {
    pkg: PackageId;
    fileName: string;
    report: string;
  }) {
    if (typeof window === "undefined") return;

    try {
      const tierLabel =
        PACKAGES.find((p) => p.id === args.pkg)?.name ?? args.pkg;

      const newItem: StoredReport = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        packageId: args.pkg,
        tierLabel,
        fileName: args.fileName,
        report: args.report,
      };

      const existingRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      let existing: StoredReport[] = [];

      if (existingRaw) {
        try {
          existing = JSON.parse(existingRaw) as StoredReport[];
        } catch {
          existing = [];
        }
      }

      // newest first
      existing.unshift(newItem);

      // keep last 20
      if (existing.length > 20) {
        existing = existing.slice(0, 20);
      }

      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
      setStatus(
        "Upload and AI report generation complete. Report saved to your local history."
      );
    } catch (err) {
      console.error("Failed to save report to localStorage:", err);
      setStatus(
        "Upload and AI report generation complete, but saving to history failed."
      );
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file) {
      setStatus("Please choose a raw DNA file before continuing.");
      return;
    }

    // 1) Snapshot is ALWAYS backend upload (no Stripe)
    // 2) Any tier with paidMode=true (came from /success) is backend upload (payment already done)
    const shouldUploadDirectly =
      selectedPkg === "snapshot" || paidMode === true;

    if (shouldUploadDirectly) {
      try {
        setLoading(true);
        setReport(null);

        const pkgName =
          PACKAGES.find((p) => p.id === selectedPkg)?.name ?? "Snapshot";

        setStatus(
          `Uploading your DNA file for the ${pkgName} report and generating an AI draft. Please wait...`
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("pkg", selectedPkg);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Upload error:", errorText);
          setStatus("Upload or report generation failed. Please try again.");
          return;
        }

        const data = await res.json();
        const returnedReport = (data.report as string) ?? "";

        if (returnedReport) {
          setReport(returnedReport);
          if (fileName) {
            saveReportToLocalStorage({
              pkg: selectedPkg,
              fileName,
              report: returnedReport,
            });
          } else {
            setStatus(
              data.message ??
                "Upload and AI report generation complete. (File name missing for history.)"
            );
          }
        } else {
          setStatus(
            data.message ??
              "Upload complete, but no report was returned from the AI engine."
          );
        }
      } catch (err) {
        console.error(err);
        setStatus("Unexpected error occurred during upload. Please try again.");
      } finally {
        setLoading(false);
      }

      return;
    }

    // If not snapshot and not in paid mode, this is pre-payment → redirect to Stripe
    const link = STRIPE_PAYMENT_LINKS[selectedPkg];

    if (!link) {
      setStatus(
        "Stripe Payment Link is not configured for this tier yet. Please contact support or try another tier."
      );
      return;
    }

    const pkgName = PACKAGES.find((p) => p.id === selectedPkg)?.name ?? "this";
    setStatus(
      `Redirecting you to secure Stripe checkout for the ${pkgName} report...`
    );

    window.location.href = link;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
      {/* HEADER */}
      <section className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Upload your raw DNA and choose your StrataHelix report.
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          We currently support raw DNA files from major platforms such as 23andMe and
          AncestryDNA. You’ll upload your file once, select a report tier, and we’ll
          use AI to generate a non-medical wellness report focused on metabolism,
          training, recovery, sleep, methylation, and supplement strategy.
        </p>
        <p className="text-[11px] text-[#6B7280]">
          Educational only. Not a medical service. No diagnoses, no disease risk
          predictions.
        </p>
        {paidMode && selectedPkg !== "snapshot" && (
          <p className="text-[11px] text-[#27E0C0]">
            Payment confirmed for{" "}
            {PACKAGES.find((p) => p.id === selectedPkg)?.name}. This step uploads your
            DNA so we can generate your report.
          </p>
        )}
      </section>

      {/* LAYOUT: left = form, right = packages */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        {/* LEFT: FILE + SUMMARY + REPORT */}
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
                Download your raw DNA file from your provider (23andMe, AncestryDNA,
                etc.) and upload it here. We don’t accept screenshots or PDF
                summaries—only the raw text file.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#D1D5DB]">
                Raw DNA file
              </label>
              <label
                className="flex cursor-pointer flex-col items-start justify-center gap-2 rounded-lg border border-dashed border-[#374151] bg-[#020617] px-4 py-5 text-xs text-[#9CA3AF] hover:border-[#27E0C0]/60 hover:bg-[#020617]"
              >
                <span className="font-medium text-[#F9FAFB]">
                  {fileName ? "File selected" : "Click to choose file"}
                </span>
                <span className="text-[11px]">
                  Accepted: raw DNA text files from 23andMe, AncestryDNA, and similar
                  platforms (usually <code>.txt</code>).
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
                You’ve currently selected:{" "}
                <span className="font-semibold text-[#F9FAFB]">
                  {PACKAGES.find((p) => p.id === selectedPkg)?.name}
                </span>{" "}
                ({PACKAGES.find((p) => p.id === selectedPkg)?.price}). You can change
                this on the right before submitting.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Processing..."
                : paidMode && selectedPkg !== "snapshot"
                ? "Upload DNA for your paid report"
                : "Continue with this file and tier"}
            </button>

            {status && (
              <p className="mt-3 text-[11px] text-[#9CA3AF] whitespace-pre-line">
                {status}
              </p>
            )}
          </form>

          {report && (
            <div className="rounded-xl border border-[#1F2933] bg-[#020617] p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">
                    AI-generated draft report (developer preview)
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    This is the structured markdown draft returned from the StrataHelix
                    AI backend. In the real product, this will be rendered as a polished
                    report or PDF.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="inline-flex items-center rounded-md border border-[#374151] px-3 py-1.5 text-[11px] font-medium text-[#F9FAFB] hover:border-[#27E0C0]/80"
                  >
                    Copy report
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="inline-flex items-center rounded-md bg-[#27E0C0] px-3 py-1.5 text-[11px] font-medium text-[#0B1014] hover:opacity-90"
                  >
                    Download .txt
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-auto rounded-lg bg-black/40 p-4 text-xs leading-relaxed space-y-2
                              [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-2
                              [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-2
                              [&_h3]:text-[13px] [&_h3]:font-semibold [&_h3]:mt-2
                              [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
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
                    setStatus(null);
                    setReport(null);
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
                      <p className="text-[11px] text-[#9CA3AF]">{pkg.blurb}</p>
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
            Snapshot uploads are handled directly by StrataHelix. Paid tiers use Stripe
            for secure checkout, and when you return from payment, this page uploads
            your DNA and triggers AI report generation.
          </p>
        </div>
      </section>
    </div>
  );
}
