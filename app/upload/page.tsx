"use client";

import React, {
  useState,
  FormEvent,
  ChangeEvent,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";

type PackageId = "snapshot" | "core" | "methylation-plus" | "elite";

export const dynamic = "force-dynamic";

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

function UploadInner() {
  const searchParams = useSearchParams();
  const pkgFromQuery = searchParams.get("pkg") as PackageId | null;

  const [selectedPkg, setSelectedPkg] = useState<PackageId>(
    (pkgFromQuery &&
      (["snapshot", "core", "methylation-plus", "elite"] as const).includes(
        pkgFromQuery,
      )
      ? pkgFromQuery
      : "snapshot")
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    setFileName(file.name);
    setStatus(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const input = (e.target as HTMLFormElement).querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;

    const file = input?.files?.[0];

    if (!file) {
      setStatus("Please choose a raw DNA file before continuing.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading file and generating draft report…");

    try {
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
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();

      setStatus(
        `Upload complete for “${data.fileName}” (${data.fileSizeBytes} bytes). The backend has your DNA file and package = ${data.package}. In the full app, this is where your report job would be queued for AI generation.`,
      );
    } catch (error) {
      console.error("Unexpected upload error:", error);
      setStatus("Unexpected error during upload. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
      {/* HEADER */}
      <section className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Upload your raw DNA and choose your StrataHelix report.
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          We currently support raw DNA files from major platforms such as
          23andMe and AncestryDNA. You’ll upload your file once, select a
          report tier, and we’ll use AI to generate a non-medical wellness
          report focused on metabolism, training, recovery, sleep,
          methylation, and supplement strategy.
        </p>
        <p className="text-[11px] text-[#6B7280]">
          Educational only. Not a medical service. No diagnoses, no disease
          risk predictions.
        </p>
      </section>

      {/* LAYOUT: left = form, right = packages */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        {/* LEFT: FILE + SUMMARY */}
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
              AncestryDNA, etc.) and upload it here. We don’t accept
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
              You’ve currently selected:{" "}
              <span className="font-semibold text-[#F9FAFB]">
                {PACKAGES.find((p) => p.id === selectedPkg)?.name}
              </span>{" "}
              ({PACKAGES.find((p) => p.id === selectedPkg)?.price}). You
              can change this on the right before submitting.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 transition disabled:opacity-60"
          >
            {isSubmitting
              ? "Uploading & generating…"
              : "Continue with this file & tier"}
          </button>

          {status && (
            <p className="mt-3 text-[11px] text-[#9CA3AF] whitespace-pre-line">
              {status}
            </p>
          )}
        </form>

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
            package to a secure checkout (for paid tiers) and then trigger
            report generation once your file is validated.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function UploadPage() {
  // Suspense wrapper satisfies Next.js’ requirement around useSearchParams
  return (
    <Suspense fallback={<div className="p-8 text-sm">Loading upload…</div>}>
      <UploadInner />
    </Suspense>
  );
}
