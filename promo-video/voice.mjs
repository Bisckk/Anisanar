// Genera la locución con ElevenLabs (SDK oficial, modelo eleven_v4) → voice/NN.mp3 + voice/lines.json (lo consume audio.mjs).
// Cada frase tiene una ventana [t, until] ligada a su escena: si no cabe, se acelera con ffmpeg (atempo, mantiene el tono).
// Caché: una frase solo se vuelve a sintetizar si cambia su texto o la voz (ahorra créditos).
//
//   La clave ELEVENLABS_API_KEY vive en ../.env.local (creada por `npx @elevenlabs/cli onboard`); el SDK la lee del entorno.
//   Opcional: ELEVEN_VOICE_ID en el entorno o en .env.local para fijar otra voz.
//   node voice.mjs --voices   → lista las voces de tu cuenta (con preview) para elegir
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const MODEL = 'eleven_v4';
const MAX_TEMPO = 1.18;

// t: inicio (s) · until: debe terminar antes (siguiente golpe visual o cambio de escena)
export const SCRIPT = [
  { t: 0.9, until: 4.55, text: 'La clínica está cerrada… pero tu web sigue atendiendo.' },
  { t: 5.25, until: 8.2, text: 'Te presentamos la nueva página web de Anisanar.' },
  { t: 9.1, until: 13.6, text: 'Tu clínica, a primera vista: con tu identidad y en cualquier dispositivo.' },
  { t: 14.5, until: 17.6, text: 'Cada uno de tus servicios tiene su propia página…' },
  { t: 18.3, until: 20.7, text: 'lista para que te encuentren en Google.' },
  { t: 21.6, until: 24.8, text: 'Tu equipo, presentado como merece.' },
  { t: 25.9, until: 30.4, text: 'Tus clientes piden cita en tres pasos, desde el celular y a cualquier hora.' },
  { t: 32.7, until: 35.85, text: 'Y la solicitud te llega al instante, directo a tu WhatsApp.' },
  { t: 37.2, until: 41.9, text: 'Más citas, menos llamadas, y una clínica fácil de encontrar.' },
  { t: 43.1, until: 46.3, text: 'Y las opiniones de tus pacientes, a la vista de todos.' },
  { t: 47.9, until: 51.5, text: 'Anisanar. Tu nueva web ya está en línea.' },
];

// recorta silencio inicial y final (audio.mjs usa el mismo filtro al decodificar)
export const TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse';
const durationOf = file => execFileSync(ffmpegPath, ['-v', 'error', '-i', file, '-af', TRIM, '-f', 'f32le', '-ac', '1', '-ar', '44100', '-'], { maxBuffer: 1 << 28 }).length / 4 / 44100;

// Voz por defecto: Bella (premade, "Professional, Bright, Warm"). Las voces de la biblioteca de la comunidad
// no se pueden usar por API en el plan gratuito; con plan de pago, define ELEVEN_VOICE_ID con la que prefieras.
const DEFAULT_VOICE = 'hpp4J3VqNfWAUOO0d1Us';

async function resolveVoice(client) {
  const id = process.env.ELEVEN_VOICE_ID || DEFAULT_VOICE;
  const { voices } = await client.voices.getAll();
  return { id, name: voices.find(v => v.voiceId === id)?.name || id };
}

async function synth(client, voiceId, i, file) {
  const audio = await client.textToSpeech.convert(voiceId, {
    text: SCRIPT[i].text,
    modelId: MODEL,
    languageCode: 'es',
    outputFormat: 'mp3_44100_128',
    seed: 1000 + i,                                          // reproducible
    previousText: SCRIPT[i - 1]?.text, nextText: SCRIPT[i + 1]?.text,   // entonación continua entre frases
    voiceSettings: { stability: 0.6, similarityBoost: 0.75 },  // narración estable y cercana
  });
  const chunks = [];
  for await (const c of Readable.fromWeb(audio)) chunks.push(c);
  writeFileSync(file, Buffer.concat(chunks));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const envFile = path.join(here, '..', '.env.local');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  if (!process.env.ELEVENLABS_API_KEY) { console.error('Falta ELEVENLABS_API_KEY: ejecuta `npx -y @elevenlabs/cli@latest onboard init` en la raíz del proyecto'); process.exit(1); }
  const client = new ElevenLabsClient();

  if (process.argv.includes('--voices')) {
    for (const v of (await client.voices.getAll()).voices) console.log(`${v.voiceId}  ${v.name}  [${v.category}]  ${v.previewUrl}`);
    process.exit(0);
  }

  const dir = path.join(here, 'voice');
  mkdirSync(dir, { recursive: true });
  const manifest = path.join(dir, 'lines.json');
  const cache = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : { lines: [] };
  const voice = await resolveVoice(client);
  const lines = [];
  for (const [i, line] of SCRIPT.entries()) {
    const window = line.until - line.t;
    const id = String(i + 1).padStart(2, '0');
    const raw = path.join(dir, `${id}.raw.mp3`), out = path.join(dir, `${id}.mp3`);
    const cached = cache.voiceId === voice.id && cache.lines.some(l => l.file === `${id}.mp3` && l.text === line.text) && existsSync(raw);
    if (!cached) await synth(client, voice.id, i, raw);
    // ajuste de duración: acelerar sin cambiar el tono si la frase no cabe en su ventana
    const rawDur = durationOf(raw);
    const tempo = rawDur > window ? Math.min(MAX_TEMPO, +(rawDur / window + 0.01).toFixed(3)) : 1;
    execFileSync(ffmpegPath, ['-v', 'error', '-y', '-i', raw, '-af', `atempo=${tempo}`, '-c:a', 'libmp3lame', '-b:a', '192k', out]);
    const dur = durationOf(out);
    console.log(`${dur <= window ? '✔' : '⚠'} ${id}  ${line.t.toFixed(2)}s  ${dur.toFixed(2)}s / ${window.toFixed(2)}s  tempo x${tempo}${cached ? '  (caché)' : ''}  "${line.text}"`);
    lines.push({ t: line.t, file: `${id}.mp3`, dur: +dur.toFixed(3), tempo, text: line.text });
  }
  writeFileSync(manifest, JSON.stringify({ voiceId: voice.id, voiceName: voice.name, model: MODEL, lines }, null, 1));
  console.log(`✔ voice/lines.json — ${voice.name}`);
}
