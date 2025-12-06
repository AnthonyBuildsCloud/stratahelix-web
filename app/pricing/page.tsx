// app/pricing/page.tsx
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      {/* PRICING HERO */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Choose your StrataHelix DNA report.
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          Start with a free Snapshot to see how we interpret your DNA. When you’re
          ready, upgrade to a deeper, AI-generated report that connects your genetics
          to metabolism, training, recovery, sleep, methylation, and supplement
          strategy—without paying “big platform” prices.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/upload?pkg=snapshot"
            className="inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 transition"
          >
            Get your free Snapshot
          </Link>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-md border border-[#27E0C0]/40 px-5 py-2.5 text-sm font-medium text-[#F9FAFB] hover:border-[#27E0C0] transition"
          >
            Upload DNA &amp; choose later
          </Link>
        </div>
      </section>

      {/* TIER CARDS */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PricingCard
          name="Snapshot"
          price="$0"
          label="Most popular starting point"
          description="2–4 page browser-based mini report with overview insights, light methylation preview, and a small supplement teaser."
          features={[
            "Raw DNA upload",
            "Executive overview",
            "Metabolism & training preview",
            "Light methylation / MTHFR preview",
            "Tiny supplement-strategy teaser",
            "In-browser only (no PDF)",
          ]}
          ctaLabel="Get Snapshot free"
          href="/upload?pkg=snapshot"
        />

        <PricingCard
          name="Core"
          price="$89"
          label="Best starting report"
          description="Full baseline DNA wellness report with action plans and foundational supplement guidance."
          features={[
            "Everything in Snapshot",
            "Full metabolism & nutrition section",
            "Training response & recovery section",
            "Sleep & circadian section",
            "Basic mood / stress-resilience overview",
            "Foundational supplement stack categories",
            "1–2 targeted supplement categories",
            "Optional PDF export",
          ]}
          ctaLabel="Upgrade to Core"
          href="/upload?pkg=core"
        />

        <PricingCard
          name="Methylation+ Performance"
          price="$149"
          label="Flagship for serious biohackers"
          highlight
          description="Deeper methylation, recovery, and supplement strategy for lifters, biohackers, and high-performers."
          features={[
            "Everything in Core",
            "Full methylation & MTHFR section (non-medical)",
            "Detox & inflammation-support overview",
            "Expanded mood, focus & stress insights",
            "Prioritized supplement strategy",
            "Top 5 action summary",
            "Premium PDF export",
          ]}
          ctaLabel="Get Methylation+ Performance"
          href="/upload?pkg=methylation-plus"
        />

        <PricingCard
          name="Elite"
          price="$219"
          label="For power users & coaches"
          description="Full-stack DNA blueprint with deeper recovery, cardio-metabolic tendencies, and example daily supplement layouts."
          features={[
            "Everything in Methylation+ Performance",
            "Genetic recovery blueprint",
            "Lifestyle-framed cardio & metabolic tendencies",
            "Example daily stack layouts (AM / pre-training / PM)",
            "Questions to discuss with your clinician",
            "Premium PDF export",
          ]}
          ctaLabel="Unlock Elite"
          href="/upload?pkg=elite"
        />
      </section>

      {/* COMPARISON TABLE */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Compare plans at a glance.
        </h2>
        <div className="overflow-x-auto border border-[#1F2933] rounded-xl bg-[#020617]">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-[#020617] text-[#9CA3AF]">
              <tr>
                <th className="px-3 py-3 text-left font-medium">Feature</th>
                <th className="px-3 py-3 text-left font-medium">Snapshot</th>
                <th className="px-3 py-3 text-left font-medium">Core</th>
                <th className="px-3 py-3 text-left font-medium">
                  Methylation+ Perf.
                </th>
                <th className="px-3 py-3 text-left font-medium">Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2933]">
              {[
                {
                  feature: "Raw DNA upload",
                  snapshot: "✅",
                  core: "✅",
                  perf: "✅",
                  elite: "✅",
                },
                {
                  feature: "Executive summary",
                  snapshot: "✅ (mini)",
                  core: "✅",
                  perf: "✅",
                  elite: "✅",
                },
                {
                  feature: "Metabolism & nutrition tendencies",
                  snapshot: "Preview",
                  core: "Full",
                  perf: "Full",
                  elite: "Full",
                },
                {
                  feature: "Training & recovery insights",
                  snapshot: "Preview",
                  core: "Full",
                  perf: "Expanded",
                  elite: "Deep dive",
                },
                {
                  feature: "Sleep & circadian profile",
                  snapshot: "–",
                  core: "Full",
                  perf: "Expanded",
                  elite: "Expanded",
                },
                {
                  feature: "Mood / stress / cognition",
                  snapshot: "–",
                  core: "Basic",
                  perf: "Expanded",
                  elite: "Expanded",
                },
                {
                  feature: "Methylation & MTHFR",
                  snapshot: "Light preview",
                  core: "Light mention",
                  perf: "Full section",
                  elite: "Full section+",
                },
                {
                  feature: "Detox & inflammation support",
                  snapshot: "–",
                  core: "–",
                  perf: "Included",
                  elite: "Deep dive",
                },
                {
                  feature: "Supplement strategy",
                  snapshot: "Tiny teaser",
                  core: "Foundational stack",
                  perf: "Full prioritized plan",
                  elite: "Plan + example daily stack",
                },
                {
                  feature: "Top 5 action summary",
                  snapshot: "Light",
                  core: "Section-level",
                  perf: "Global Top 5",
                  elite: "Extended roadmap",
                },
                {
                  feature: "PDF export",
                  snapshot: "–",
                  core: "Optional",
                  perf: "Included",
                  elite: "Included",
                },
              ].map((row) => (
                <tr key={row.feature}>
                  <td className="px-3 py-3 text-[#E5E7EB]">{row.feature}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{row.snapshot}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{row.core}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{row.perf}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{row.elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-[#6B7280]">
          All reports are educational and non-medical. StrataHelix does not
          diagnose, treat, cure, or prevent any disease.
        </p>
      </section>

      {/* CTA STRIP */}
      <section className="rounded-xl border border-[#1F2933] bg-gradient-to-r from-[#020617] to-[#020617] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
            Start with a free Snapshot. Upgrade only if it earns your trust.
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-xl mt-1">
            Upload your raw DNA once, generate your free StrataHelix Snapshot, and
            see how our AI interprets your genetics. If it clicks, unlock a deeper
            report that fits your goals and budget.
          </p>
        </div>
        <Link
          href="/upload?pkg=snapshot"
          className="inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 transition"
        >
          Get your free Snapshot
        </Link>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Frequently asked questions.
        </h2>
        <div className="space-y-4 text-sm text-[#D1D5DB]">
          <FaqItem
            question="Is StrataHelix a medical service?"
            answer={`No. StrataHelix is an educational wellness platform, not a medical service. Our reports do not diagnose, treat, cure, or prevent any disease, and they are not a substitute for medical advice, lab testing, or care from a qualified clinician. We focus on helping you understand how your genetics may influence things like metabolism, recovery, sleep, and methylation, then translate that into practical ideas for nutrition, lifestyle, and supplement categories to discuss with your healthcare provider.`}
          />
          <FaqItem
            question="Do you tell me exactly which supplements to buy and what dose to take?"
            answer={`We don’t prescribe supplements, brands, or dosages. Instead, we highlight supplement categories (for example, omega-3s, magnesium, or methylation-supportive B-complexes) that may be relevant based on your genetics and goals. We also tag them by priority and use-case (Daily / Cycle / Situational) so you can have a more focused conversation with your clinician or make more informed choices when you shop.`}
          />
          <FaqItem
            question="Do you look at MTHFR?"
            answer={`Yes—MTHFR is one of several methylation-related genes we consider in our deeper reports, particularly in the Methylation+ Performance and Elite tiers. We explain common MTHFR variants in plain language and in context with other pathways, without turning them into a diagnosis or a source of fear. The goal is to show how methylation could fit into your overall wellness strategy—not to define you by one gene.`}
          />
          <FaqItem
            question="How is StrataHelix different from other DNA wellness platforms?"
            answer={`We’re built to feel as serious and polished as the big DNA platforms—but with a simpler model and more accessible pricing. We start with raw DNA uploads you already have, structure our reports like a strategy memo (not a wall of traits), and charge simple one-time prices instead of complex subscriptions.`}
          />
          <FaqItem
            question="What raw DNA files do you support?"
            answer={`We aim to support raw DNA files from major consumer genetics companies such as 23andMe and AncestryDNA, and may add others over time. As long as you can download a standard raw DNA text file from your provider, there’s a good chance StrataHelix can read it. We’ll list supported file types on the upload page and keep that updated as we expand.`}
          />
          <FaqItem
            question="Do I need to take a new DNA test to use StrataHelix?"
            answer={`In most cases, no. If you’ve already done testing with a major provider like 23andMe or AncestryDNA, you can usually download your raw DNA file from their website and upload it to StrataHelix. That’s one of the ways we keep costs down compared with platforms that require you to buy a new kit.`}
          />
        </div>
      </section>
    </div>
  );
}

function PricingCard(props: {
  name: string;
  price: string;
  label: string;
  description: string;
  features: string[];
  ctaLabel: string;
  href: string;
  highlight?: boolean;
}) {
  const { name, price, label, description, features, ctaLabel, href, highlight } =
    props;

  return (
    <div
      className={`flex flex-col rounded-xl border bg-[#020617] p-5 ${
        highlight
          ? "border-[#27E0C0] shadow-lg shadow-[#27E0C0]/25"
          : "border-[#1F2933]"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#27E0C0]/10 px-3 py-1 text-[11px] text-[#27E0C0] uppercase tracking-[0.18em]">
            {label}
          </span>
          <span className="text-xs text-[#9CA3AF]">One-time</span>
        </div>
        <h3 className="text-base font-semibold">{name}</h3>
        <p className="text-2xl font-semibold">{price}</p>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
      </div>
      <ul className="mt-4 space-y-1 text-xs text-[#D1D5DB]">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-[#27E0C0] mt-[2px]">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-5 inline-flex items-center justify-center rounded-md px-4 py-2 text-xs font-medium transition ${
          highlight
            ? "bg-[#27E0C0] text-[#0B1014] hover:opacity-90"
            : "border border-[#27E0C0]/40 text-[#F9FAFB] hover:border-[#27E0C0]"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-4">
      <p className="text-sm font-semibold mb-1">{question}</p>
      <p className="text-xs text-[#9CA3AF] whitespace-pre-line">{answer}</p>
    </div>
  );
}
