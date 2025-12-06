import Link from "next/link";

type PackageId = "core" | "methylation-plus" | "elite";

const PACKAGE_CONTENT: Record<
  PackageId,
  { name: string; description: string; bullets: string[] }
> = {
  core: {
    name: "Core",
    description:
      "You’ll receive a non-medical, educational report based on your raw DNA. No disease diagnoses, no lab orders, no treatment recommendations.",
    bullets: [
      "Baseline wellness blueprint across metabolism, training response, recovery, sleep, and stress.",
      "Clear, practical levers to test in your nutrition, training, and lifestyle.",
      "Designed to plug into your existing routine without needing new lab work.",
    ],
  },
  "methylation-plus": {
    name: "Methylation+ Performance",
    description:
      "Adds deeper analysis of methylation-related genes and performance recovery patterns, with more detailed supplement strategy.",
    bullets: [
      "Expanded methylation and detox lens (including common MTHFR patterns).",
      "Performance- and recovery-focused recommendations for lifters and athletes.",
      "More specific supplement architecture (non-medical, educational only).",
    ],
  },
  elite: {
    name: "Elite",
    description:
      "Full-stack StrataHelix blueprint with recovery, cardio-metabolic focus, and detailed supplement stack layouts.",
    bullets: [
      "Highest-resolution view across metabolic health, training, recovery, and sleep.",
      "Supplement stack layouts organized by goal (energy, recovery, focus, resilience).",
      "Best suited for serious self-optimizers who track data and want a deep roadmap.",
    ],
  },
};

// Tell Next.js this route is dynamic so it won't try to fully pre-render it
export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: { pkg?: string };
};

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const rawPkg = (searchParams.pkg as PackageId | undefined) ?? "core";
  const validIds: PackageId[] = ["core", "methylation-plus", "elite"];
  const pkg: PackageId = validIds.includes(rawPkg) ? rawPkg : "core";

  const content = PACKAGE_CONTENT[pkg];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      {/* HEADER */}
      <section className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#27E0C0]">
          Payment confirmed
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Your StrataHelix {content.name} report is confirmed.
        </h1>
        <p className="text-sm text-[#9CA3AF] max-w-2xl">
          Thank you for choosing the {content.name} tier. Next, upload your raw
          DNA file so we can generate your AI-guided, non-medical wellness
          blueprint based on your genetics.
        </p>
      </section>

      {/* SELECTED TIER CARD */}
      <section className="rounded-xl border border-[#1F2933] bg-[#020617] p-6 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          Selected tier
        </h2>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-[#F9FAFB]">
            {content.name}
          </p>
          <p className="text-sm text-[#9CA3AF]">{content.description}</p>
          <ul className="mt-3 space-y-1 text-xs text-[#9CA3AF] list-disc list-inside">
            {content.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="space-y-3 text-sm text-[#9CA3AF]">
        <h2 className="text-sm font-semibold text-[#F9FAFB]">
          What happens next
        </h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Make sure you have your raw DNA file downloaded from 23andMe,
            AncestryDNA, or another supported platform.
          </li>
          <li>
            Go to the upload page and submit your raw DNA file with this tier so
            we can start generating your StrataHelix report.
          </li>
          <li>
            You&apos;ll receive your report as a structured, AI-generated
            browser experience or downloadable file depending on your package.
          </li>
        </ol>
      </section>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/upload?pkg=${pkg}`}
          className="inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 transition"
        >
          Go to upload page
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-[#1F2933] px-5 py-2.5 text-sm font-medium text-[#F9FAFB] hover:border-[#27E0C0]/80 hover:bg-[#020617] transition"
        >
          Back to homepage
        </Link>
      </div>

      {/* DISCLAIMER */}
      <p className="text-[11px] text-[#6B7280] max-w-2xl">
        If you reached this page by accident or have questions about your
        purchase, please contact support. All StrataHelix reports are for
        educational and informational purposes only and are not a substitute for
        medical advice.
      </p>
    </div>
  );
}
