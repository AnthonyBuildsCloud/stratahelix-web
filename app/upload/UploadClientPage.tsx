"use client";

import React, { useState, FormEvent } from "react";
import type { PackageId } from "@/types/packages";

// Simple tier metadata – adjust copy/prices as you like
const PACKAGE_DETAILS: Record<PackageId, { 
  label: string; 
  price: string; 
  description: string; 
  badge?: string;
}> = {
  snapshot: {
    label: "Snapshot",
    price: "$0",
    description: "Free mini report to preview how StrataHelix interprets your DNA.",
    badge: "Browser report",
  },
  core: {
    label: "Core",
    price: "$89",
    description: "Full baseline DNA wellness report with action steps.",
    badge: "One-time",
  },
  "methylation+": {   // ✅ key now matches PackageId
    label: "Methylation+ Performance",
    price: "$149",
    description: "Deeper methylation, performance, and supplement strategy.",
    badge: "One-time",
  },
  elite: {
    label: "Elite",
    price: "$219",
    description: "Full-stack blueprint with recovery, cardio-metabolic and stack layouts.",
    badge: "One-time",
  },
};


interface UploadClientPageProps {
  initialPackage: PackageId;
}

export default function UploadClientPage({
  initialPackage,
}: UploadClientPageProps) {
  const [selectedPackage, setSelectedPackage] =
    useState<PackageId>(initialPackage);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus("");
    setError(null);
    setReport(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setReport(null);

    if (!file) {
      setError("Please select a raw DNA text file before continuing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("package", selectedPackage);

    setIsSubmitting(true);
    setStatus("Uploading file and generating report…");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);
      console.log("Upload response:", data);

      if (!res.ok || !data) {
        const msg =
          data?.error ||
          `Upload or report generation failed (status ${res.status}).`;
        throw new Error(msg);
      }

      // Keep the green banner behavior
      if (data.message) {
        setStatus(data.message);
      } else {
        const sizeKB = Math.round(file.size / 1024);
        setStatus(
          `Upload complete for "${file.name}" (${sizeKB} KB). Report generated.`
        );
      }

      // New: capture the AI report text (may be null if demo mode)
      setReport(typeof data.report === "string" ? data.report : null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(
        err?.message ||
          "Upload or report generation failed. Please try again."
      );
      setStatus("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Header copy */}
        <header className="mb-10 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Step 1 · Upload DNA
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-slate-300">
            Download your raw DNA file from your provider (23andMe, AncestryDNA,
            etc.) and upload it here. We don&apos;t accept screenshots or PDF
            summaries—only the raw text file.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* LEFT: Upload + status + report viewer */}
          <section className="space-y-6">
            {/* Upload card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl shadow-slate-900/40">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Raw DNA file */}
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Raw DNA file
                  </h2>
                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-6">
                    <p className="mb-3 text-sm text-slate-300">
                      Accepted: raw DNA text files from 23andMe, AncestryDNA,
                      and similar platforms (usually <code>.txt</code>).
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-cyan-400 transition">
                        <span>Select DNA text file</span>
                        <input
                          type="file"
                          accept=".txt,.csv,.tsv"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>

                      <div className="text-xs text-slate-400">
                        {file ? (
                          <>
                            Selected:{" "}
                            <span className="font-medium text-cyan-300">
                              {file.name}
                            </span>
                          </>
                        ) : (
                          <>No file selected yet.</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 copy */}
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Step 2 · Confirm report tier
                  </h2>
                  <p className="text-xs text-slate-400">
                    You&apos;ve currently selected:{" "}
                    <span className="font-semibold text-cyan-300">
                      {PACKAGE_DETAILS[selectedPackage].label}
                    </span>
                    . You can change this on the right before submitting.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !file}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow disabled:cursor-not-allowed disabled:opacity-60 hover:bg-cyan-400 transition"
                >
                  {isSubmitting
                    ? "Uploading & generating report…"
                    : "Continue with this file & tier"}
                </button>

                {/* Status + error banners */}
                <div className="space-y-3">
                  {status && (
                    <div className="rounded-xl border border-emerald-600/70 bg-emerald-900/30 px-4 py-3 text-xs text-emerald-200">
                      {status}
                    </div>
                  )}
                  {error && (
                    <div className="rounded-xl border border-rose-600/70 bg-rose-950/40 px-4 py-3 text-xs text-rose-200">
                      {error}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Report viewer */}
            {report && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/40">
                <h2 className="mb-3 text-sm font-semibold tracking-tight text-slate-100">
                  Snapshot report preview
                </h2>
                <p className="mb-3 text-xs text-slate-400">
                  This is the AI-generated interpretation of your uploaded DNA
                  file based on the{" "}
                  <span className="font-semibold text-cyan-300">
                    {PACKAGE_DETAILS[selectedPackage].label}
                  </span>{" "}
                  tier. Educational only – not medical advice.
                </p>
                <div className="max-h-[28rem] overflow-auto rounded-xl border border-slate-800/70 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {report}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: Package selector */}
          <aside className="space-y-4">
            <div className="mb-2">
              <h2 className="text-sm font-semibold tracking-tight">
                Choose your report
              </h2>
              <p className="text-xs text-slate-400">
                You can start free and upgrade later.
              </p>
            </div>

            <div className="space-y-3">
              {(Object.keys(PACKAGE_DETAILS) as PackageId[]).map((id) => {
                const pkg = PACKAGE_DETAILS[id];
                const isActive = selectedPackage === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setSelectedPackage(id);
                      setReport(null); // reset any old report if they change tiers
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition",
                      isActive
                        ? "border-cyan-500/80 bg-cyan-950/40 shadow-[0_0_0_1px_rgba(34,211,238,0.3)]"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/80",
                    ].join(" ")}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {pkg.label}
                        </span>
                        {pkg.badge && (
                          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-300">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-50">
                        {pkg.price}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="pt-2 text-[10px] leading-relaxed text-slate-500">
              In the production version, this column will connect your chosen
              tier to a secure checkout (for paid tiers) and then trigger report
              generation once your file is validated. Educational only. Not a
              medical service. No diagnoses, no disease risk predictions.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
