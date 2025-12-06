import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY environment variable.");
      return NextResponse.json(
        {
          ok: false,
          error:
            "Server configuration error: missing OPENAI_API_KEY. Please set it in your .env.local file.",
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const formData = await req.formData();

    const file = formData.get("file");
    const pkg = (formData.get("pkg") as string | null) ?? "snapshot";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded or invalid file field." },
        { status: 400 }
      );
    }

    const fileText = await file.text();
    const snippet = fileText.slice(0, 10_000);

    const systemPrompt = `
You are StrataHelix, an AI assistant that turns raw consumer DNA data into structured, non-medical wellness reports.

Rules:
- DO NOT give medical advice, diagnoses, disease risk scores, or treatment recommendations.
- DO NOT mention specific SNP IDs, genotypes, or "you have this mutation" style language.
- Stay in the lane of lifestyle, training, nutrition, recovery, stress, sleep, and supplement *categories*.
- Always remind the user this is educational only and not a substitute for a clinician.
- Tone: serious biohacker / performance consultant. No fear-mongering, no childish language.

Tier expectations:
- snapshot: short, high-level preview. Executive snapshot + 3–5 bullets and 3 quick-start actions.
- core: deeper sections for Metabolism, Training, Sleep, Stress/Mood, Supplement Categories.
- methylation-plus: core + dedicated “Methylation & Recovery Support” section and “Priority focus areas”.
- elite: methylation-plus + a structured “Example daily rhythm” section (AM / Training / Evening).

Goal:
Use the DNA snippet as soft context only. You’re NOT doing clinical genetics. You’re mapping tendencies and giving structured, experiment-friendly guidance, similar in style to a professional wellness + training consultant.
`;

    const userPrompt = `
User package tier: ${pkg}

Raw DNA snippet (context only, do NOT echo this back or mention specific SNP IDs):
--------------------
${snippet}
--------------------

Using the style and structure below, generate a StrataHelix report that matches the selected tier.

=== STRUCTURE GUIDELINES BY TIER ===

For SNAPSHOT (pkg = "snapshot"):
- Title: "StrataHelix Snapshot – high-level preview"
- Section 1: Executive snapshot (2 short paragraphs)
- Section 2: "Key tendencies we might explore" – 3–5 bullets
- Section 3: "Quick-start experiments (non-medical)" – 3–5 simple habits

For CORE (pkg = "core"):
- Title: "StrataHelix Core DNA wellness report"
- Intro: Short overview of this being non-medical, education-focused.
- Section: "Metabolism & nutrition tendencies"
- Section: "Training response & recovery"
- Section: "Sleep, circadian rhythm & stress"
- Section: "Focus, mood & mental performance"
- Section: "Supplement categories to consider" (categories only, no dosages, no brand names)

For METHYLATION-PLUS (pkg = "methylation-plus"):
- Title: "StrataHelix Methylation+ Performance report"
- Intro: Non-medical, focused on performance and recovery.
- Include all CORE sections, plus:
  - Section: "Methylation & recovery support (non-medical)"
    - Explain in plain language how methylation-related patterns might influence energy, recovery, and stress handling, WITHOUT naming specific SNPs or giving diagnoses.
    - Emphasize lifestyle levers and high-level supplement categories (e.g., “methylation-supportive B-complex”, “magnesium for recovery”).
  - Section: "Priority focus areas" – top 3–5 themes for this user to focus on.

For ELITE (pkg = "elite"):
- Title: "StrataHelix Elite full-stack performance blueprint"
- Intro: As above, but slightly more executive/strategic.
- Include all METHYLATION-PLUS sections, plus:
  - Section: "Cardio-metabolic & longevity-relevant levers" – directional, non-medical.
  - Section: "Example daily rhythm (non-prescriptive)"
    - Subheadings like:
      - "Morning – prime the system"
      - "Training window – performance & recovery"
      - "Evening – downshift and repair"
    - Keep this as an example schedule, not a strict protocol.

Overall style:
- Executive summary
- Clear section titles
- Short paragraphs and bullet lists
- Non-medical, no references to lab values, no treatment advice
- Address the user as a high-agency biohacker / lifter / high-performer who wants data-informed experiments.

End with a short disclaimer section titled "Important context & disclaimer" that reinforces:
- This is educational only.
- Not a medical service.
- Not a replacement for a doctor, diagnostics, or lab work.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2200,
    });

    const report = completion.choices[0].message.content ?? "";

    return NextResponse.json({
      ok: true,
      package: pkg,
      fileName: file.name,
      fileSizeBytes: file.size,
      report,
      message:
        "DNA file received and AI report draft generated. This is a non-medical, educational DNA wellness summary.",
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unexpected server error while handling upload. Check server logs for details.",
      },
      { status: 500 }
    );
  }
}
