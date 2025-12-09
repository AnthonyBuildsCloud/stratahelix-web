// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_PROMPT_CHARS = 120_000;            // limit text sent to the model
const MAX_FILE_BYTES = 4 * 1024 * 1024;      // ~4 MB soft limit for now

export async function POST(req: NextRequest) {
  try {
    // 1) Read multipart form-data
    const formData = await req.formData();
    const file = formData.get("file");
    const pkgRaw = formData.get("package") ?? formData.get("packageId");
    const packageId =
      typeof pkgRaw === "string" && pkgRaw.length > 0 ? pkgRaw : "snapshot";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No DNA file found in the request." },
        { status: 400 }
      );
    }

    // 2) Basic size guard (helps avoid Vercel limits for now)
    if (file.size > MAX_FILE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          ok: false,
          error: `This demo currently supports files up to 4 MB. Your file is ~${sizeMB} MB. Try a smaller test export for now.`,
        },
        { status: 400 }
      );
    }

    const sizeKB = Math.round(file.size / 1024);

    // 3) Read file text and truncate for the prompt
    const rawText = await file.text();
    const truncated =
      rawText.length > MAX_PROMPT_CHARS
        ? rawText.slice(0, MAX_PROMPT_CHARS)
        : rawText;

    // 4) Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;

    // If there's no key, behave like a stub success so the UX still works
    if (!apiKey) {
      console.warn(
        "OPENAI_API_KEY missing – returning stub success response instead of calling the model."
      );
      return NextResponse.json(
        {
          ok: true,
          message: `Upload complete for "${file.name}" (${sizeKB} KB). Demo mode: AI report generation is disabled (no API key set).`,
          report: null,
        },
        { status: 200 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // 5) Build prompts
    const systemPrompt = `
You are StrataHelix, a DNA-powered wellness assistant.
You receive raw genotype text from services like 23andMe.
The user selected the package tier "${packageId}".

Only use SNPs / genotypes that are present in the text.
If a marker isn't present, clearly say it's not available.
Return a concise, human-readable report tailored to this package tier.
Output in clean markdown with headings and bullet points.
`.trim();

    const userPrompt = `
Here is the raw DNA text file (it may be truncated for prompt size limits):

${truncated}
`.trim();

    // 6) Call the OpenAI Responses API
    const aiResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `${systemPrompt}\n\n${userPrompt}`,
    });

    // 7) Extract plain text from the response
    const anyResp = aiResponse as any;
    const reportText =
      anyResp.output_text ??
      anyResp.output?.[0]?.content?.[0]?.text ??
      "";

    if (!reportText) {
      console.error("OpenAI response had no text:", aiResponse);
      return NextResponse.json(
        {
          ok: false,
          error:
            "The AI model did not return any text. Please try again with a smaller file or later.",
        },
        { status: 500 }
      );
    }

    // 8) Success – keep the old UX message, add the full report
    return NextResponse.json(
      {
        ok: true,
        message: `Upload complete for "${file.name}" (${sizeKB} KB).`,
        report: reportText,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while handling upload:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error while handling upload." },
      { status: 500 }
    );
  }
}
