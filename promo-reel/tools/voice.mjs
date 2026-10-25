// Narración del reel en UNA toma continua (como las referencias) + tiempos por palabra para sincronizar la tipografía.
//   node tools/voice.mjs            → assets/voice/narration.mp3 + assets/voice/words.json
// La clave ELEVENLABS_API_KEY vive en ../.env.local (no se versiona). Voz: Bella (premade), modelo eleven_v4, español.
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '..', '.env.local');
if (existsSync(envFile)) process.loadEnvFile(envFile);
const VOICE = process.env.ELEVEN_VOICE_ID || 'hpp4J3VqNfWAUOO0d1Us';

export const SCRIPT = [
  '¿Qué tiene mi perro?',
  'Esa es la pregunta equivocada.',
  'La pregunta es: ¿quién lo va a cuidar?',
  'En San Gil, desde 2011, la respuesta es Anisanar.',
  'Consulta, cirugía, laboratorio, hospitalización y fisioterapia.',
  'Todo bajo un mismo techo.',
  'Nueve profesionales que tratan a tu mascota como familia.',
  'Por eso nueve de cada diez familias nos recomiendan.',
  '¿Agendar? Desde anisanar punto com, directo a WhatsApp.',
  'Anisanar. Cuidamos a tu mejor amigo.',
].join(' ');

const client = new ElevenLabsClient();
const out = path.join(root, 'assets', 'voice', 'narration.mp3');
if (!process.argv.includes('--times-only')) {
  const audio = await client.textToSpeech.convert(VOICE, {
    text: SCRIPT, modelId: 'eleven_v4', languageCode: 'es', outputFormat: 'mp3_44100_128', seed: 2026,
    voiceSettings: { stability: 0.45, similarityBoost: 0.75 },   // algo más expresiva que una locución neutra
  });
  const chunks = []; for await (const c of Readable.fromWeb(audio)) chunks.push(c);
  writeFileSync(out, Buffer.concat(chunks));
}
// tiempos por palabra (transcripción de la propia toma)
const r = await client.speechToText.convert({ file: new Blob([readFileSync(out)], { type: 'audio/mpeg' }), modelId: 'scribe_v2', languageCode: 'es', timestampsGranularity: 'word' });
const words = r.words.filter(w => w.type === 'word').map((w, i) => ({ id: `w${i}`, text: w.text, start: +w.start.toFixed(3), end: +w.end.toFixed(3) }));
writeFileSync(path.join(root, 'assets', 'voice', 'words.json'), JSON.stringify(words, null, 1));
console.log(`✔ ${words.length} palabras, ${words.at(-1).end.toFixed(2)} s`);
console.log(words.map(w => `${w.start.toFixed(2)} ${w.text}`).join(' | '));
