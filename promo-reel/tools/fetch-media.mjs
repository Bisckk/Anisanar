// Descarga música y efectos de Mixkit (Licencia Gratuita: uso comercial sin atribución; no se redistribuyen sueltos,
// por eso no se versionan) y copia el tecleo de la biblioteca de HyperFrames (Pixabay). Mide el pico de cada efecto.
//   node tools/fetch-media.mjs   → assets/sfx/*.mp3, assets/music/bed.mp3, assets/sfx/peaks.json
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ffmpeg = path.join(root, '..', 'promo-video', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
// Paleta de productor para una clínica cálida: golpes secos y cortos (nada de tráiler), aire suave en los movimientos,
// sonidos de interfaz reales solo donde hay interfaz. Sin glitch, sin campanas, sin impactos cinematográficos.
export const SFX = {
  'hit-a': 2299,     // Short bass hit       — palabra de énfasis que aterriza (golpe corto, sin cola)
  'hit-b': 2151,     // Soft quick punch
  'hit-c': 2161,     // Air in a hit
  'swish-a': 1461,   // Short wind swoosh    — barridos (whip) y cortes del montaje
  'swish-b': 1464,   // Quick swoosh accent
  'swish-c': 175,    // Short transition sweep
  'zoom-in': 2608,   // Air zoom vacuum      — la cámara atraviesa hacia la puerta
  'zoom-out': 2627,  // Fast swipe zoom      — el celular crece hasta ser el cierre
  'pops': 3005,      // Explainer video pops — las 9 caras aparecen en onda
  'pop': 2364,       // Hard pop click       — los datos de contacto aparecen
  'message': 2354,   // Message pop alert    — llega el mensaje de WhatsApp
};
const MUSIC = 473;   // Talent in the Air (melódica, suave)

mkdirSync(path.join(root, 'assets', 'sfx'), { recursive: true });
mkdirSync(path.join(root, 'assets', 'music'), { recursive: true });
const get = async (url, out) => {
  if (existsSync(out)) return;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
};
for (const [name, id] of Object.entries(SFX)) await get(`https://assets.mixkit.co/active_storage/sfx/${id}/${id}-preview.mp3`, path.join(root, 'assets', 'sfx', `${name}.mp3`));
await get(`https://assets.mixkit.co/music/${MUSIC}/${MUSIC}.mp3`, path.join(root, 'assets', 'music', 'bed.mp3'));
// biblioteca de HyperFrames (Pixabay, uso comercial libre): tecleo, teclas sueltas para las palabras, brillo del logo
const LIB = { typing: 'typing.mp3', 'key-a': 'key-press.mp3', 'key-b': 'click-soft.mp3', sparkle: 'sparkle.mp3' };
for (const [name, file] of Object.entries(LIB)) copyFileSync(path.join(root, '..', '.agents', 'skills', 'media-use', 'audio', 'assets', 'sfx', file), path.join(root, 'assets', 'sfx', name + '.mp3'));

// pico de cada efecto (segundos desde su inicio): sirve para que el pico caiga 1 frame después de su imagen
const peaks = {};
for (const name of [...Object.keys(SFX), ...Object.keys(LIB)]) {
  const raw = execFileSync(ffmpeg, ['-nostdin', '-v', 'error', '-i', path.join(root, 'assets', 'sfx', `${name}.mp3`), '-ac', '1', '-ar', '22050', '-f', 'f32le', '-'], { maxBuffer: 1 << 26 });
  const x = new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
  let pk = 0, pi = 0; for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) > pk) { pk = Math.abs(x[i]); pi = i; }
  peaks[name] = { peak: +(pi / 22050).toFixed(3), dur: +(x.length / 22050).toFixed(3) };
}
writeFileSync(path.join(root, 'assets', 'sfx', 'peaks.json'), JSON.stringify(peaks, null, 1));
console.log('✔ media lista', peaks);
