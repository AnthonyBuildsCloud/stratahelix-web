// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type PackageId = "snapshot" | "core" | "methylation-plus" | "elite";

interface UploadRequestBody {
  pkg: PackageId;
  fileName: string;
  fileSizeBytes: number;
  markers: Record<string, string>; // rsid -> genotype (e.g., "rs1815739": "CC")
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UploadRequestBody;

    const { pkg, fileName, fileSizeBytes, markers } = body ?? {};

    if (!pkg || !fileName || !fileSizeBytes || !markers) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing pkg, file metadata, or markers in request body.",
        },
        { status: 400 }
      );
    }

    const markerEntries = Object.entries(markers);

    if (markerEntries.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No relevant genetic markers were found in the uploaded file for this package.",
        },
        { status: 400 }
      );
    }

    const markersSummary = markerEntries
      .map(([rsid, genotype]) => `${rsid}: ${genotype}`)
      .join("\n");

    const pkgLabelMap: Record<PackageId, string> = {
      snapshot: "Snapshot (free preview)",
      core: "Core (baseline wellness)",
      "methylation-plus": "Methylation+ Performance",
      elite: "Elite (full-stack blueprint)",
    };

    const pkgLabel = pkgLabelMap[pkg];

    const userPrompt = [
      `You are StrataHelix, a non-medical DNA wellness interpreter.`,
      `The user has uploaded a raw DNA file. The app has already extracted only the SNPs needed for the selected report tier.`,
      "",
      `Selected package tier: ${pkgLabel}`,
      `Original file name: ${fileName}`,
      `Original file size (bytes): ${fileSizeBytes}`,
      "",
      "Relevant SNP genotypes for this package (rsid: genotype):",
      markersSummary,
      "",
      "Using ONLY this genetic information and general wellness knowledge:",
      "- Generate a tier-appropriate, non-medical wellness report.",
      "- Focus on metabolism, training, recovery, sleep, stress, cardio-metabolic health, and supplementation guidance, depending on the tier depth.",
      "- Do NOT mention SNP IDs or genotypes directly in the user-facing text (keep that internal).",
      "- Keep everything clearly non-medical: no diagnoses, no treatment, no disease risk prediction.",
      "- For Snapshot: keep it shorter, like an executive preview.",
      "- For Core: add more structured sections and experiments.",
      "- For Methylation+ and Elite: go deeper on methylation, recovery, performance, and protocols.",
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 1600,
      messages: [
        {
          role: "system",
          content:
            "You are StrataHelix, a DNA-powered wellness guide. You provide structured, non-medical, experiment-focused guidance based on genetics.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const report =
      completion.choices[0]?.message?.content ??
      "AI report generation produced an empty response.";

    return NextResponse.json({
      ok: true,
      package: pkg,
      fileName,
      fileSizeBytes,
      markersUsedCount: markerEntries.length,
      report,
      message:
        "DNA markers received and AI report draft generated successfully.",
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected server error while handling upload.",
      },
      { status: 500 }
    );
  }
}
