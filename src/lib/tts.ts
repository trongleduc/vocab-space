import "server-only";

/** True when /api/tts can serve Azure neural voices (see src/app/api/tts/route.ts). */
export function ttsConfigured() {
  return Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION);
}
