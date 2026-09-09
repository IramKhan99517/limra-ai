import { NextRequest, NextResponse } from "next/server";
import { getRequestUser, unauthorized } from "@/lib/authServer";
import { analyzeText, analyzeWithAI, type ContractAnalysis } from "@/lib/contractAnalyzer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/* ------------------------------------------------------------------ */
/* Text extraction — txt / docx / pdf (zero extra dependencies)        */
/* ------------------------------------------------------------------ */

function extractFromTxt(buf: Buffer): string {
  return buf.toString("utf8");
}

/** Minimal ZIP (docx) reader: find word/document.xml, inflateRaw, strip XML. */
function extractFromDocx(buf: Buffer): string {
  // Locate End of Central Directory record
  const eocdSig = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66000; i--) {
    if (buf.readUInt32LE(i) === eocdSig) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip");

  const entryCount = buf.readUInt16LE(eocd + 10);
  const cdOffset = buf.readUInt32LE(eocd + 16);

  let pos = cdOffset;
  for (let n = 0; n < entryCount; n++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const method = buf.readUInt16LE(pos + 10);
    const compSize = buf.readUInt32LE(pos + 20);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localOffset = buf.readUInt32LE(pos + 42);
    const name = buf.toString("utf8", pos + 46, pos + 46 + nameLen);

    if (name === "word/document.xml") {
      // Read the local file header to find where data actually starts
      if (buf.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("bad zip entry");
      const lNameLen = buf.readUInt16LE(localOffset + 26);
      const lExtraLen = buf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lNameLen + lExtraLen;
      const raw = buf.subarray(dataStart, dataStart + compSize);
      const xml =
        method === 0
          ? raw.toString("utf8")
          : require("zlib").inflateRawSync(raw).toString("utf8");
      // Paragraph boundaries → newlines, then strip tags and decode entities
      return xml
        .replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }
    pos += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("document.xml not found");
}

/** Best-effort PDF text: inflate FlateDecode streams, pull Tj/TJ strings. */
function extractFromPdf(buf: Buffer): string {
  const chunks: string[] = [];
  const streamStart = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = streamStart.exec(buf.toString("latin1"))) !== null) {
    const start = m.index + m[0].length;
    const end = buf.indexOf("endstream", start);
    if (end < 0) break;
    const raw = buf.subarray(start, end);
    let text: string | null = null;
    try {
      // Try zlib inflate; if it fails, treat as raw content stream.
      text = require("zlib").inflateSync(raw).toString("latin1");
    } catch {
      try {
        text = require("zlib").inflateRawSync(raw).toString("latin1");
      } catch {
        text = raw.toString("latin1");
      }
    }
    if (text && /\bTj\b|\bTJ\b/.test(text)) chunks.push(text);
    streamStart.lastIndex = end + 9;
  }

  const out: string[] = [];
  for (const chunk of chunks) {
    // (text) Tj   and   [(a) -12 (b)] TJ
    const re = /\((?:\\.|[^\\()])*\)/g;
    let s: RegExpExecArray | null;
    let line = "";
    while ((s = re.exec(chunk)) !== null) {
      const inner = s[0]
        .slice(1, -1)
        .replace(/\\([nrt()\\])/g, (_all, c: string) =>
          c === "n" ? "\n" : c === "r" ? "" : c === "t" ? "\t" : c,
        );
      line += inner;
    }
    if (line.trim()) out.push(line.trim());
  }
  return out.join("\n");
}

function extractText(name: string, buf: Buffer): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf") || buf.subarray(0, 4).toString("latin1") === "%PDF") {
    return extractFromPdf(buf);
  }
  if (lower.endsWith(".docx")) {
    return extractFromDocx(buf);
  }
  return extractFromTxt(buf);
}

/* ------------------------------------------------------------------ */
/* Route                                                              */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");
    const lang = form.get("lang") === "ar" ? "ar" : "en";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "tooLarge" }, { status: 413 });
    }

    const lower = file.name.toLowerCase();
    const allowed =
      lower.endsWith(".pdf") || lower.endsWith(".docx") || lower.endsWith(".txt") || lower.endsWith(".md");
    if (!allowed) {
      return NextResponse.json({ error: "type" }, { status: 415 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    let text = "";
    try {
      text = extractText(file.name, buf);
    } catch {
      text = "";
    }
    text = text.replace(/\u0000/g, " ").trim();

    if (text.length < 40) {
      return NextResponse.json({ error: "empty" }, { status: 422 });
    }

    const analysis: ContractAnalysis = (await analyzeWithAI(text, lang)) ?? analyzeText(text);

    return NextResponse.json({
      fileName: file.name,
      ...analysis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
