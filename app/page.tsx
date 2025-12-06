"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:items-center lg:gap-16">
        {/* LEFT: HERO COPY + CTAs */}
        <section className="flex-1 space-y-6">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#22C55E] uppercase">
            DNA-powered wellness intelligence
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            strategic advantage for{" "}
            <span className="text-[#27E0C0]">your health.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-[#9CA3AF]">
            StrataHelix transforms 23andMe, Ancestry, and other raw DNA files
            into layered, AI-driven wellness intelligence—built for biohackers,
            lifters, and high-performers who want data, not guesswork. Non-medical.
            No diagnoses. Just clear, actionable insights.
          </p>

          <ul className="space-y-2 text-sm text-[#9CA3AF]">
            <li className="flex gap-2">
              <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-[#27E0C0]" />
              <span>
                Layered genetic analysis across metabolism, recovery,
                cardio health, cognition, sleep, and more.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-[#27E0C0]" />
              <span>
                AI-powered interpretation that turns complex genomics into
                practical recommendations.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-[#27E0C0]" />
              <span>
                Performance-focused design for people tracking macros, reps, HRV, and labs.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-[#27E0C0]" />
              <span>Supplement & lifestyle guidance aligned with your genetics.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-[#27E0C0]" />
              <span>
                Non-medical by design—educational and optimization-focused.
              </span>
            </li>
          </ul>

          {/* PRIMARY CTA ROW */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/upload?pkg=snapshot"
              className="inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-4 py-2.5 text-sm font-medium text-[#020617] hover:opacity-90 transition"
            >
              Upload your DNA file
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-[#1F2933] bg-[#020617] px-4 py-2.5 text-sm font-medium text-[#E5E7EB] hover:border-[#27E0C0]/70 transition"
            >
              View pricing
            </Link>
          </div>

          {/* SECONDARY LINK: SAMPLE REPORT */}
          <div className="pt-1">
            <Link
              href="/sample-report"
              className="text-xs text-[#9CA3AF] underline underline-offset-4 hover:text-[#E5E7EB]"
            >
              Or see a full sample report first
            </Link>
          </div>

          <p className="pt-4 text-[11px] text-[#6B7280] max-w-md">
            Works with 23andMe, Ancestry, and most major raw DNA uploads. Start
            free with a StrataHelix Snapshot. Educational only. Not a medical
            service. No diagnoses, no disease risk predictions.
          </p>
        </section>

        {/* RIGHT: SAMPLE REPORT PREVIEW CARD */}
        <section className="flex-1 hidden lg:block">
          <div className="rounded-xl border border-[#1F2933] bg-gradient-to-b from-[#020617] to-[#020617] p-5 shadow-[0_22px_60px_rgba(15,23,42,0.8)]">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#64748B] uppercase">
                  Sample report
                </p>
                <p className="text-sm font-medium text-[#F9FAFB] mt-1">
                  StrataHelix DNA Snapshot
                </p>
              </div>
              <Link
                href="/sample-report"
                className="rounded-full bg-[#0B1120] px-3 py-1 text-[11px] font-medium text-[#27E0C0] border border-[#1F2933] hover:border-[#27E0C0]/70 transition"
              >
                Preview full report
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-[#020617] border border-[#111827] p-3">
                <p className="text-[11px] font-semibold text-[#9CA3AF] mb-1">
                  Executive overview
                </p>
                <p className="text-[11px] text-[#E5E7EB] leading-relaxed">
                  Your genetics suggest a strong response to resistance training,
                  elevated demand for recovery, and benefit from consistent sleep.
                </p>
              </div>

              <div className="rounded-lg bg-[#020617] border border-[#111827] p-3">
                <p className="text-[11px] font-semibold text-[#9CA3AF] mb-1">
                  Metabolism & nutrition
                </p>
                <p className="text-[11px] text-[#E5E7EB] leading-relaxed">
                  Balanced carb/fat response with appetite signaling that
                  rewards high-protein, structured meals.
                </p>
              </div>

              <div className="rounded-lg bg-[#020617] border border-[#111827] p-3">
                <p className="text-[11px] font-semibold text-[#9CA3AF] mb-1">
                  Methylation & support
                </p>
                <p className="text-[11px] text-[#E5E7EB] leading-relaxed">
                  Common variants suggest paying attention to B-vitamin sufficiency,
                  recovery habits, and sleep hygiene.
                </p>
              </div>

              <div className="rounded-lg bg-[#020617] border border-[#111827] p-3">
                <p className="text-[11px] font-semibold text-[#9CA3AF] mb-1">
                  Supplement strategy
                </p>
                <p className="text-[11px] text-[#E5E7EB] leading-relaxed">
                  Foundational omega-3s, magnesium, vitamin D, and a targeted
                  methylation-supportive B-complex—always discussed with your clinician.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
