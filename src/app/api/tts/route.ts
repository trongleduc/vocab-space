import { getUser } from "@/lib/auth";
import { findVoice, MAX_TTS_CHARS } from "@/lib/voices";

/**
 * Neural text-to-speech through Azure Speech. Only active when AZURE_SPEECH_KEY and
 * AZURE_SPEECH_REGION are set; otherwise it answers 503 and the client uses the browser voice.
 *
 * GET /api/tts?v=<voice id>&r=<rate 0.5–1.5>&t=<text>
 * Responses are immutable for a given URL, so the browser cache serves repeat plays for free.
 */

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

// Small per-instance cache so the same word played by several members only costs one Azure call.
const memory = new Map<string, ArrayBuffer>();
const MEMORY_LIMIT = 300;

export async function GET(request: Request) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return new Response("TTS not configured", { status: 503 });
  if (!(await getUser())) return new Response("Unauthorized", { status: 401 });

  const params = new URL(request.url).searchParams;
  const voice = findVoice(params.get("v"));
  const text = (params.get("t") ?? "").trim();
  const rate = Math.min(1.5, Math.max(0.5, Number(params.get("r")) || 1));
  if (!voice || !text || text.length > MAX_TTS_CHARS) return new Response("Bad request", { status: 400 });

  const cacheKey = `${voice.id}|${rate}|${text}`;
  let audio = memory.get(cacheKey);
  if (!audio) {
    const pct = Math.round((rate - 1) * 100);
    const ssml =
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voice.locale}">` +
      `<voice name="${voice.id}"><prosody rate="${pct >= 0 ? "+" : ""}${pct}%">${escapeXml(text)}</prosody></voice></speak>`;
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "vocab-space",
      },
      body: ssml,
    });
    if (!res.ok) return new Response("TTS upstream error", { status: 502 });
    audio = await res.arrayBuffer();
    if (memory.size >= MEMORY_LIMIT) memory.delete(memory.keys().next().value!);
    memory.set(cacheKey, audio);
  }

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
