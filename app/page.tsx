// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27E0C0]">
            DNA-powered wellness intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Turn raw DNA into a strategic advantage for your health.
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-xl">
            StrataHelix transforms 23andMe, Ancestry, and other raw DNA files into
            layered, AI-driven wellness intelligence—built for biohackers, lifters,
            and high-performers who want data, not guesswork. Non-medical. No
            diagnoses. Just clear, actionable insights.
          </p>

          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            <li>
              <span className="text-[#27E0C0] mr-2">•</span>
              Layered genetic analysis across metabolism, recovery, cardio health,
              cognition, sleep, and more.
            </li>
            <li>
              <span className="text-[#27E0C0] mr-2">•</span>
              AI-powered interpretation that turns complex genomics into practical
              recommendations.
            </li>
            <li>
              <span className="text-[#27E0C0] mr-2">•</span>
              Performance-focused design for people tracking macros, reps, HRV, and labs.
            </li>
            <li>
              <span className="text-[#27E0C0] mr-2">•</span>
              Supplement &amp; lifestyle guidance aligned with your genetics.
            </li>
            <li>
              <span className="text-[#27E0C0] mr-2">•</span>
              Non-medical by design—educational and optimization-focused.
            </li>
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2.5 text-sm font-medium text-[#0B1014] hover:opacity-90 transition"
            >
              Upload your DNA file
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-[#27E0C0]/40 px-5 py-2.5 text-sm font-medium text-[#F9FAFB] hover:border-[#27E0C0] transition"
            >
              View sample report &amp; pricing
            </Link>
          </div>

          <p className="text-xs text-[#6B7280] pt-1">
            Works with 23andMe, Ancestry, and most major raw DNA uploads. Start free
            with a StrataHelix Snapshot.
          </p>
        </div>

        {/* Right-side mock preview */}
        <div className="hidden lg:block">
          <div className="rounded-xl border border-[#1F2933] bg-gradient-to-b from-[#111827] to-[#020617] p-5 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B7280]">
                  Sample report
                </p>
                <p className="text-sm font-medium">StrataHelix DNA Snapshot</p>
              </div>
              <span className="rounded-full bg-[#27E0C0]/15 px-3 py-1 text-[11px] text-[#27E0C0]">
                Preview
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-3">
                <p className="text-[11px] text-[#6B7280] mb-1">
                  Executive overview
                </p>
                <p className="text-xs">
                  Your genetics suggest a strong response to resistance training with
                  elevated demand for recovery and sleep quality support.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-3">
                  <p className="text-[11px] text-[#6B7280] mb-1">
                    Metabolism &amp; nutrition
                  </p>
                  <p className="text-xs">
                    Balanced carb/fat response with appetite signaling that benefits
                    from high-protein, structured meals.
                  </p>
                </div>
                <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-3">
                  <p className="text-[11px] text-[#6B7280] mb-1">
                    Methylation &amp; support
                  </p>
                  <p className="text-xs">
                    Common variants suggest paying attention to folate/B-vitamin
                    sufficiency and recovery habits.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-3">
                <p className="text-[11px] text-[#6B7280] mb-1">Supplement strategy</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Foundational: omega-3s, magnesium, vitamin D.</li>
                  <li>
                    Targeted: methylation-supportive B-complex (discuss with your
                    clinician).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          What StrataHelix does.
        </h2>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          StrataHelix is a DNA-powered wellness intelligence platform for serious
          self-optimizers. Upload your raw DNA file from 23andMe, Ancestry, or similar
          services, and our AI engine deconstructs your genetic data into layered
          insights across metabolism, training response, recovery, sleep, cognition,
          and more. Instead of vague traits or medical scare tactics, you get a
          structured, non-medical report that translates your genome into clear,
          practical guidance for your nutrition, supplements, and lifestyle.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <FeaturePillar
            title="Decode"
            body="We parse your raw DNA into meaningful patterns across key wellness domains—metabolism, recovery, methylation, and more."
          />
          <FeaturePillar
            title="Translate"
            body="We convert those patterns into plain-language insights you don’t need a PhD to understand."
          />
          <FeaturePillar
            title="Act"
            body="We outline practical nutrition, training, and supplement categories so you can execute with confidence."
          />
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Built for people who take their health seriously.
        </h2>
        <p className="text-sm text-[#9CA3AF]">
          If you treat your health like a long-term project, StrataHelix is built for you.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "Biohackers",
            "Lifters & athletes",
            "Health-savvy parents",
            "High-performing professionals",
          ].map((label) => (
            <span
              key={label}
              className="rounded-full border border-[#1F2933] bg-[#020617] px-3 py-1 text-[#D1D5DB]"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* SNAPSHOT TEASER */}
      <section className="space-y-4 rounded-xl border border-[#1F2933] bg-[#020617] p-6">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
          Try a free DNA Snapshot first.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl">
          Upload your raw DNA file once and get a StrataHelix Snapshot: a mini,
          browser-based report with an executive overview, a light methylation preview,
          a training/recovery highlight, and a tiny supplement-strategy teaser. If you
          like the way we interpret your genetics, you can upgrade to a full report.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/upload?pkg=snapshot"
            className="inline-flex items-center justify-center rounded-md bg-[#27E0C0] px-5 py-2 text-sm font-medium text-[#0B1014] hover:opacity-90 transition"
          >
            Get your free Snapshot
          </Link>
          <span className="text-xs text-[#6B7280]">
            No credit card required. One free Snapshot per user.
          </span>
        </div>
      </section>

      {/* MINI PRICING PREVIEW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Choose your StrataHelix report.
          </h2>
          <Link
            href="/pricing"
            className="text-xs text-[#27E0C0] hover:underline"
          >
            View full pricing
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <MiniTierCard
            badge="Free"
            name="Snapshot"
            price="$0"
            description="2–4 page mini report in your browser. See how we interpret your DNA before you pay."
          />
          <MiniTierCard
            badge="Best start"
            name="Core"
            price="$89"
            description="Full baseline DNA wellness report with action plans and foundational supplement guidance."
          />
          <MiniTierCard
            badge="Flagship"
            name="Methylation+ Performance"
            price="$149"
            description="Deeper methylation, recovery, and supplement strategy for serious biohackers and lifters."
          />
        </div>
      </section>
    </div>
  );
}

function FeaturePillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-4">
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-[#9CA3AF]">{body}</p>
    </div>
  );
}

function MiniTierCard({
  badge,
  name,
  price,
  description,
}: {
  badge: string;
  name: string;
  price: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[#1F2933] bg-[#020617] p-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#27E0C0]/10 px-3 py-1 text-[11px] text-[#27E0C0] uppercase tracking-widest">
            {badge}
          </span>
          <span className="text-xs text-[#9CA3AF]">One-time</span>
        </div>
        <h3 className="text-sm font-semibold">{name}</h3>
        <p className="text-2xl font-semibold">{price}</p>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
      </div>
      <Link
        href="/pricing"
        className="mt-4 inline-flex items-center justify-center rounded-md border border-[#27E0C0]/40 px-3 py-2 text-xs font-medium text-[#F9FAFB] hover:border-[#27E0C0] transition"
      >
        See details
      </Link>
    </div>
  );
}
