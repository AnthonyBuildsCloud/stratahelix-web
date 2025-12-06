"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PackageId = "snapshot" | "core" | "methylation-plus" | "elite";

const PACKAGE_COPY: Record<
  PackageId,
  {
    title: string;
    subtitle: string;
    bullets: string[];
  }
> = {
  snapshot: {
    title: "Your StrataHelix Snapshot is ready.",
    subtitle:
      "You’ve unlocked a free preview report so you can see how StrataHelix interprets your DNA. Upload your file to generate your Snapshot.",
    bullets: [
      "Quick, non-medical overview of key genetic tendencies.",
      "3–5 simple, low-risk lifestyle levers to experiment with.",
      "Designed as a gateway into deeper StrataHelix tiers.",
    ],
  },
  core: {
    title: "Your StrataHelix Core report is confirmed.",
    subtitle:
      "Thank you for choosing the StrataHelix Core report. Next, upload your raw DNA file so we can generate your baseline wellness blueprint.",
    bullets: [
      "Metabolism, training response, recovery, sleep, and mood tendencies.",
      "Clear, non-medical insights with practical lifestyle and training ideas.",
      "High-level supplement categories aligned with your genetic profile.",
    ],
  },
  "methylation-plus": {
    title: "Your Methylation+ Performance report is confirmed.",
    subtitle:
      "You’ve unlocked deeper methylation and performance-focused analysis. Upload your raw DNA file so we can build your Methylation+ blueprint.",
    bullets: [
      "Core coverage plus an added focus on methylation and recovery pathways.",
      "Contextual, plain-language discussion of methylation-related genes (including MTHFR-style patterns) without medical diagnoses.",
      "Prioritized focus areas for training, recovery, and supplement categories.",
    ],
  },
  elite: {
    title: "Your StrataHelix Elite report is confirmed.",
    subtitle:
      "You’ve unlocked the full-stack Elite blueprint. Upload your raw DNA file so we can generate your high-resolution performance and longevity map.",
    bullets: [
      "Everything in Core and Methylation+, plus cardio-metabolic and recovery depth.",
      "Strategic ‘daily rhythm’ guidance (AM, pre-training, PM) in non-medical language.",
      "Refined supplement category priorities and stack-structure suggestions.",
    ],
  },
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const pkgParam = (searchParams.get("pkg") as PackageId | null) ?? "core";

  // Fall back safely if unknown pkg hits this page
  const pkg: PackageId =
    pkgParam && (["snapshot", "core", "methylation-plus", "elite"] as const).includes(pkgParam)
      ? pkgParam
      : "core";

  const info = PACKAGE_COPY[pkg];
  const uploadHref = `/upload?pkg=${pkg}&paid=1`;

  const tierLabel =
    pkg === "snapshot"
      ? "Snapshot"
      : pkg === "core"
      ? "Core"
      : pkg === "methylation-plus"
      ? "Methylation+ Performance"
      : "Elite";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.22em] text-[#27E0C0] uppercase">
          Payment confirmed
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {info.title}
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          {info.subtitle}
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-start">
        {/* Left: Tier card */}
        <div className="rounded-xl border border-[#020617] bg-[#020617]">
          <div className="border-b border-[#111827] px-6 py-4">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#6B7280] uppercase">
              Selected tier
            </p>
            <p className="mt-1 text-lg font-semibold text-[#F9FAFB]">{tierLabel}</p>
            <p className="mt-1 text-[11px] text-[#9CA3AF]">
              You’ll receive a non-medical, educational report based on your raw DNA.
              No disease diagnoses, no lab orders, no treatment recommendations.
            </p>
          </div>

          <div className="px-6 py-5 space-y-3">
            <p className="text-xs font-semibold text-[#D1D5DB]">
              What happens next
            </p>
            <ul className="space-y-2 text-[11px] text-[#9CA3AF]">
              {info.bullets.map((b, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-[2px] h-[5px] w-[5px] rounded-full bg-[#27E0C0]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4 rounded-xl border border-[#1F2933] bg-[#020617] px-6 py-5">
          <p className="text-xs font-semibold text-[#D1D5DB]">
            Upload your DNA to generate the report
          </p>
          <ol className="space-y-2 text-[11px] text-[#9CA3AF]">
            <li>
              <span className="font-semibold text-[#F9FAFB]">1.</span>{" "}
              Download your raw DNA file from 23andMe, AncestryDNA, or another supported
              platform.
            </li>
            <li>
              <span className="font-semibold text-[#F9FAFB]">2.</span>{" "}
              Go to the upload page and submit your raw DNA file. We’ll validate the
              file and hand it off to the StrataHelix AI engine.
            </li>
            <li>
              <span className="font-semibold text-[#F9FAFB]">3.</span>{" "}
              You’ll receive your report as a structured, AI-generated browser report
              (and later optional PDF) depending on your tier.
            </li>
          </ol>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={uploadHref}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-[#27E0C0] px-4 py-2.5 text-sm font-medium text-[#020617] hover:opacity-90 transition"
            >
              Go to upload page
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-[#374151] px-4 py-2.5 text-sm font-medium text-[#F9FAFB] hover:border-[#27E0C0]/70 transition"
            >
              Back to homepage
            </Link>
          </div>

          <p className="text-[10px] text-[#6B7280] pt-1">
            If you reached this page by accident or have questions about your purchase,
            please contact support. All StrataHelix reports are for educational and
            informational purposes only and are not a substitute for medical advice.
          </p>
        </div>
      </section>
    </div>
  );
}
