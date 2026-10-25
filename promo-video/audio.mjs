// Sintetiza la banda sonora completa (música + efectos + voz) en soundtrack-<video>.wav.
//   node audio.mjs [video]   (video: ver videos.mjs; por defecto "entrega")
// Los efectos se colocan desde cues-<video>.json, exportado por la misma timeline GSAP (node render.mjs --cues),
// así cada sonido cae en el frame exacto de su animación. La estructura musical (window.MUSIC) también sale de la página.
// Paleta: cálida y sutil — pad redondo, marimba, pulso discreto; efectos de "aire" y campanas suaves.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import { TRIM } from './voice.mjs';
import { pickVideo } from './videos.mjs';
import { SFX as LIB, MUSIC as TRACKS, sfxFile, musicFile } from './sounds.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const video = pickVideo();
// --sfx-only: solo los efectos de las animaciones (sin música ni voz) para revisarlos uno a uno → <video>-sfx.wav
const SFX_ONLY = process.argv.includes('--sfx-only');
if (SFX_ONLY) video.soundtrack = video.soundtrack.replace(/.wav$/, '-sfx.wav');
// siempre regenerar los cues para que el audio siga a la timeline actual
execFileSync(process.execPath, [path.join(here, 'render.mjs'), video.id, '--cues'], { stdio: 'inherit' });
const { duration: DUR, cues, music } = JSON.parse(readFileSync(path.join(here, video.cues), 'utf8'));

const SR = 44100;
const N = Math.ceil(DUR * SR);
const TAU = Math.PI * 2;
const bus = () => [new Float32Array(N), new Float32Array(N)];
const MUSIC = bus(), KICK = bus(), SFX = bus(), VERB = bus();

// PRNG determinista → mismo audio en cada build
let seed = 0x9e3779b9;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
const midi = n => 440 * Math.pow(2, (n - 69) / 12);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

class BQ { // biquad RBJ
  constructor(type, f, q = 0.707) { this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set(type, f, q); }
  set(type, f, q = 0.707) {
    f = clamp(f, 20, SR * 0.45);
    const w = TAU * f / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
    let b0, b1, b2;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; }
    const a0 = 1 + a;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = -2 * c / a0; this.a2 = (1 - a) / a0;
  }
  p(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y;
  }
}

// voice(target, t0, len, fn(tt, i) → mono), con paneo y envío a reverb
function voice(target, t0, len, fn, { pan = 0, gain = 1, verb = 0 } = {}) {
  const s0 = Math.round(t0 * SR), n = Math.round(len * SR);
  for (let i = 0; i < n; i++) {
    const k = s0 + i; if (k < 0 || k >= N) continue;
    const p = typeof pan === 'function' ? pan(i / SR) : pan;
    const v = fn(i / SR, i) * gain;
    const l = v * Math.cos((p + 1) * Math.PI / 4), r = v * Math.sin((p + 1) * Math.PI / 4);
    target[0][k] += l; target[1][k] += r;
    if (verb) { VERB[0][k] += l * verb; VERB[1][k] += r * verb; }
  }
}
const env = (tt, a, d) => tt < a ? tt / a : Math.exp(-(tt - a) / d);
// campana suave tipo marimba/kalimba: fundamental + parcial 4x muy corto
const mallet = (f, tt, dec) => (Math.sin(TAU * f * tt) + 0.25 * Math.sin(TAU * f * 4 * tt) * Math.exp(-tt / 0.025)) * env(tt, 0.004, dec);

// ── Efectos de sonido ──────────────────────────────────────────────────────
const FX = {
  // "aire": ruido filtrado ancho, pico de frecuencia moderado, envolvente redonda
  whoosh({ t, gain = 1 }, len = 0.8, f0 = 300, f1 = 1600, g = 0.2) {
    const bp = new BQ('bp', f0, 0.7), lp = new BQ('lp', 3000);
    voice(SFX, t - len * 0.55, len, (tt, i) => {
      const x = tt / len;
      if (i % 32 === 0) bp.set('bp', f0 + (f1 - f0) * Math.sin(Math.PI * Math.min(1, x * 1.1)), 0.7);
      const a = Math.pow(Math.sin(Math.PI * x), 2);
      return lp.p(bp.p(noise())) * a * 1.8;
    }, { pan: tt => -0.4 + 0.8 * (tt / len), gain: g * gain, verb: 0.3 });
  },
  whooshSoft(c) { FX.whoosh(c, 0.6, 500, 2000, 0.11); },
  swish(c) { FX.whoosh(c, 0.45, 800, 2600, 0.08); },
  swipe(c) { FX.whoosh(c, 0.3, 900, 2400, 0.05); },
  // "bloom": grave redondo + acorde de campana, sin ruido ni golpe seco
  impact({ t, gain = 1 }) {
    voice(SFX, t, 2.4, tt => Math.sin(TAU * (52 * tt + 20 * 0.08 * (1 - Math.exp(-tt / 0.08)))) * env(tt, 0.03, 0.7), { gain: 0.3 * gain, verb: 0.25 });
    [60, 67, 72, 76].forEach((n, i) => voice(SFX, t + i * 0.012, 2.4, tt => mallet(midi(n), tt, 0.9), { gain: 0.045 * gain, verb: 0.6, pan: (i - 1.5) * 0.3 }));
  },
  // subida suave que se desvanece (no corta en seco)
  riser({ t, gain = 1, dur = 1.5 }) {
    const lp = new BQ('lp', 300);
    voice(SFX, t, dur + 0.3, (tt, i) => {
      const x = Math.min(1, tt / dur);
      if (i % 32 === 0) lp.set('lp', 300 + 1800 * x * x, 0.8);
      const a = Math.pow(x, 2) * (tt > dur ? Math.max(0, 1 - (tt - dur) / 0.3) : 1);
      return lp.p(noise()) * a * 0.9 + Math.sin(TAU * (400 + 400 * x) * tt) * a * 0.05;
    }, { gain: 0.16 * gain, verb: 0.5 });
  },
  pop({ t, gain = 1, pitch = 1 }) {
    let ph = 0;
    voice(SFX, t, 0.14, tt => { ph += TAU * (620 + 260 * (1 - Math.exp(-tt / 0.015))) * pitch / SR; return Math.sin(ph) * env(tt, 0.003, 0.035); },
      { gain: 0.11 * gain, verb: 0.15 });
  },
  // clic de cursor: "tock" blando
  click({ t, gain = 1 }) {
    voice(SFX, t, 0.08, tt => Math.sin(TAU * 1300 * tt) * Math.exp(-tt / 0.006) * 0.5 + Math.sin(TAU * 260 * tt) * Math.exp(-tt / 0.018) * 0.6,
      { gain: 0.2 * gain, verb: 0.08 });
  },
  // toque en pantalla táctil
  tap({ t, gain = 1 }) {
    voice(SFX, t, 0.08, tt => Math.sin(TAU * 900 * tt) * Math.exp(-tt / 0.007) * 0.45 + Math.sin(TAU * (300 - 500 * tt) * tt) * Math.exp(-tt / 0.02) * 0.6,
      { gain: 0.2 * gain, verb: 0.06 });
  },
  tick({ t, gain = 1, pitch = 1 }) {
    voice(SFX, t, 0.04, tt => Math.sin(TAU * 1800 * pitch * tt) * Math.exp(-tt / 0.005), { gain: 0.08 * gain });
  },
  key({ t, gain = 1, pitch = 1 }) {
    const bp = new BQ('bp', 1800 * pitch * (0.9 + rnd() * 0.2), 0.9), lp = new BQ('lp', 4000);
    voice(SFX, t, 0.045, tt => lp.p(bp.p(noise())) * Math.exp(-tt / 0.006) * 1.6 + Math.sin(TAU * 160 * tt) * Math.exp(-tt / 0.01) * 0.25,
      { gain: 0.11 * gain, pan: (rnd() - 0.5) * 0.25 });
  },
  bell(t, f, g, dec = 0.35, pan = 0, verb = 0.4) { voice(SFX, t, dec * 5, tt => mallet(f, tt, dec), { gain: g, verb, pan }); },
  chime({ t, gain = 1, pitch = 1 }) { FX.bell(t, midi(84) * pitch, 0.06 * gain, 0.35); },
  check({ t, gain = 1, pitch = 1 }) { FX.bell(t, midi(79) * pitch, 0.07 * gain, 0.25, 0.1); },
  success({ t, gain = 1 }) { [72, 76, 79, 84].forEach((n, i) => FX.bell(t + i * 0.08, midi(n), 0.08 * gain, 0.5, (i - 1.5) * 0.25, 0.55)); },
  notify({ t, gain = 1 }) { FX.bell(t, midi(81), 0.09 * gain, 0.35); FX.bell(t + 0.12, midi(88), 0.09 * gain, 0.5); },
  shimmer({ t, gain = 1 }) {
    [84, 88, 91, 96, 91].forEach((n, i) => FX.bell(t + i * 0.06, midi(n), 0.025 * gain, 0.4, (i - 2) * 0.3, 0.7));
  },
  pad() {},
};
// ── Efectos grabados (sounds/, ver sounds.mjs); si falta un archivo se usa el sintetizado de FX ──
const soundsDir = path.join(here, 'sounds');
const decode = (file, args = [], ch = 1) => {
  const raw = execFileSync(ffmpegPath, ['-nostdin', '-v', 'error', ...args.pre ?? [], '-i', file, ...(args.post ?? []), '-f', 'f32le', '-ac', String(ch), '-ar', String(SR), '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
};
const sampleCache = {};
function sample(id, { reverse = false, lowpass = 0 } = {}) {
  const key = `${id}|${reverse}|${lowpass}`;
  if (key in sampleCache) return sampleCache[key];
  const file = path.join(soundsDir, sfxFile(id));
  if (!existsSync(file)) return (sampleCache[key] = null);
  const x = decode(file, { post: ['-af', [TRIM, reverse && 'areverse', lowpass && `lowpass=f=${lowpass}`].filter(Boolean).join(',')] });
  let pk = 0, pi = 0;
  for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) > pk) { pk = Math.abs(x[i]); pi = i; }
  for (let i = 0; i < x.length; i++) x[i] *= 0.7 / (pk || 1);   // todos a pico -3 dB antes de su ganancia de mezcla
  return (sampleCache[key] = { x, peak: pi });
}
const uses = {};
function playSample(c) {
  const def = LIB[c.type];
  if (!def) return false;
  const n = (uses[c.type] = (uses[c.type] ?? 0) + 1) - 1;
  const id = def.ids ? def.ids[n % def.ids.length] : def.alt && n % 2 ? def.alt : def.id;
  const s = sample(id, def);
  if (!s) return false;
  // variación de velocidad: rotación propia del tipo × "pitch" del cue (p. ej. pops escalonados ascendentes)
  const rate = (def.rates ? def.rates[n % def.rates.length] : 1) * clamp(c.pitch ?? 1, 0.85, 1.25);
  // el pico del sonido cae 1 fotograma DESPUÉS de su imagen (la luz llega antes que el sonido; adelantado se nota más)
  const anchor = (def.alignEnd ? c.t + (c.dur ?? 0) : c.t) + 1 / 30;
  const len = Math.floor(s.x.length / rate), data = new Float32Array(len), g = def.gain * (c.gain ?? 1);
  for (let i = 0; i < len; i++) { const p = i * rate, j = Math.floor(p), f = p - j; data[i] = ((s.x[j] ?? 0) * (1 - f) + (s.x[j + 1] ?? 0) * f) * g; }
  // se mezcla más tarde (levelEvents), cuando ya existen música y voz para medir la "cama"
  EVENTS.push({ type: c.type, start: Math.round((anchor - s.peak / rate / SR) * SR), peakAt: Math.round(anchor * SR), data, target: def.target ?? 3 });
  return true;
}
const EVENTS = [];
let recorded = 0;
for (const c of cues) {
  if (playSample(c)) recorded++;
  else (FX[c.type] || (() => console.warn('cue sin sonido:', c.type)))(c);
}
console.log(`✔ efectos: ${recorded}/${cues.length} grabados${recorded < cues.length ? ' (resto sintetizados)' : ''}`);

// ── Música: 120 BPM, Cmaj7–Am7–Fmaj7–G, grid alineado con los golpes de la timeline ──
// Estructura por video (window.MUSIC en la página); por defecto, la del video de entrega:
// beat 8 = 4.62s (logo), pausa en el beat 70, beat 93 ≈ 47.12 (cierre).
const M = { t0: 0.62, drop: 8, arpFrom: 8.6, breakIn: 45.4, final: 93, end: 52.6, pause: [70, 71], ...music };
const BEAT = 0.5, T0 = M.t0;
const beatT = b => T0 + b * BEAT;
const CH = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67]];
const ROOT = [36, 33, 41, 43];
const DROP = beatT(M.drop), BREAK_IN = M.breakIn, FINAL = beatT(M.final), END = M.end;
const [OUT_A, OUT_B] = M.pause ? M.pause.map(beatT) : [-1, -1];
const playing = t => (t >= DROP && t < BREAK_IN && !(t >= OUT_A && t < OUT_B)) || (t >= FINAL && t < END);
const kicks = [];

// Pista grabada (window.MUSIC.track): se recorta y se ajusta a 120 BPM para que su "drop" caiga en el beat M.drop
const track = M.track && TRACKS[M.track.id];
const trackFile = track && path.join(soundsDir, musicFile(M.track.id));
const useTrack = !!track && existsSync(trackFile);
if (useTrack && !SFX_ONLY) {
  const tempo = track.stretch === false ? 1 : 120 / track.bpm;           // factor atempo (<1 = un poco más lenta)
  const start = track.stretch === false ? track.start ?? 0 : track.drop - tempo * DROP;  // segundo de la pista donde arranca el video
  const st = decode(trackFile, { pre: ['-ss', start.toFixed(3)], post: ['-t', String(DUR / tempo + 1), '-af', `atempo=${tempo.toFixed(5)}`] }, 2);
  let e = 0; for (let i = 0; i < st.length; i++) e += st[i] * st[i];
  const g = 0.11 / Math.sqrt(e / st.length) * (M.track.gain ?? 1);
  for (let k = 0; k < N && 2 * k + 1 < st.length; k++) {
    const fadeIn = Math.min(1, k / (0.12 * SR));
    MUSIC[0][k] += st[2 * k] * g * fadeIn; MUSIC[1][k] += st[2 * k + 1] * g * fadeIn;
  }
  console.log(`✔ música: ${track.title} desde ${start.toFixed(2)} s, x${tempo.toFixed(4)}${track.stretch === false ? ' (velocidad original)' : ` → drop en ${DROP.toFixed(2)} s`}`);
}

// Música sintetizada (respaldo si no hay pista grabada)
if (!useTrack && !SFX_ONLY) {
// Pad: senos + triángulo suave, filtro cálido
{
  const lpL = new BQ('lp', 900), lpR = new BQ('lp', 900);
  const ph = new Float64Array(20);
  for (let k = 0; k < N; k++) {
    const t = k / SR;
    const bar = Math.max(0, Math.floor((t - T0) / (BEAT * 4)));
    const chord = t >= FINAL ? [48, 60, 64, 67, 71] : CH[bar % 4];
    const energy = t < DROP ? 0.5 + 0.5 * (t / DROP) : t < BREAK_IN ? 1 : t < FINAL ? 0.75 : 1.05;
    if (k % 64 === 0) { const f = t < DROP ? 700 + 500 * (t / DROP) : 1400; lpL.set('lp', f, 0.6); lpR.set('lp', f * 1.04, 0.6); }
    let l = 0, r = 0;
    chord.forEach((n, j) => {
      for (let d = 0; d < 2; d++) {
        const idx = j * 2 + d, f = midi(n) * Math.pow(2, (d ? 0.06 : -0.06) / 12);
        ph[idx] = (ph[idx] + f / SR) % 1;
        const tri = 1 - 4 * Math.abs(ph[idx] - 0.5);
        const v = Math.sin(ph[idx] * TAU) * 0.7 + tri * 0.3;
        if (d) r += v; else l += v;
      }
    });
    const fadeIn = Math.min(1, t / 1.5), fadeOut = t > END ? Math.max(0, 1 - (t - END) / (DUR - END - 0.2)) : 1;
    const breathe = 0.85 + 0.15 * Math.sin(TAU * t / 4);
    const a = 0.03 * energy * fadeIn * fadeOut * breathe;
    MUSIC[0][k] += lpL.p(l) * a; MUSIC[1][k] += lpR.p(r) * a;
    VERB[0][k] += lpL.y1 * a * 0.35; VERB[1][k] += lpR.y1 * a * 0.35;
  }
}
// Pulso, bajo y marimba, beat a beat
for (let b = 0; beatT(b) < DUR; b++) {
  const t = beatT(b);
  const bar = Math.floor(b / 4), chord = t >= FINAL ? [60, 64, 67, 71] : CH[bar % 4], root = t >= FINAL ? 36 : ROOT[bar % 4];
  if (playing(t)) {
    // bombo redondo y bajo, en negras (medio tiempo en el cierre)
    if (t < FINAL || b % 2 === 1) {
      kicks.push(t);
      const lp = new BQ('lp', 220);
      voice(KICK, t, 0.4, tt => lp.p(Math.sin(TAU * (50 * tt + 60 * 0.025 * (1 - Math.exp(-tt / 0.025))))) * Math.exp(-tt / 0.16) * 1.3, { gain: 0.32 });
    }
    // shaker muy discreto en contratiempo
    const hp = new BQ('hp', 6000), lp2 = new BQ('lp', 10000);
    voice(MUSIC, t + BEAT / 2, 0.08, tt => lp2.p(hp.p(noise())) * env(tt, 0.012, 0.025), { gain: 0.045, pan: 0.3 });
    // bajo sinusoidal suave
    voice(MUSIC, t, BEAT * 0.9, tt => Math.sin(TAU * midi(root) * tt) * env(tt, 0.01, 0.22), { gain: 0.16 });
  }
  // marimba: arpegio en corcheas en la parte central del video
  if (t >= M.arpFrom && t < BREAK_IN + 1 && !(t >= OUT_A && t < OUT_B)) {
    for (let s = 0; s < 2; s++) {
      if ((b * 2 + s) % 8 === 7) continue;     // respiración: una nota en silencio por compás
      const n = chord[(b * 2 + s) % chord.length] + 12;
      const fade = t > BREAK_IN ? Math.max(0, 1 - (t - BREAK_IN)) : 1;
      voice(MUSIC, t + s * BEAT / 2, 0.5, tt => mallet(midi(n), tt, 0.12), { gain: 0.04 * fade, verb: 0.5, pan: s ? 0.3 : -0.3 });
    }
  }
  // en el cierre, notas largas de marimba sobre el acorde final
  if (t >= FINAL && t < END && b % 2 === 0) {
    const n = [72, 76, 79, 83][(b / 2) % 4];
    voice(MUSIC, t, 1.5, tt => mallet(midi(n), tt, 0.4), { gain: 0.04, verb: 0.7, pan: ((b / 2) % 2 ? 0.3 : -0.3) });
  }
}
// Sidechain ligero: la música respira con el pulso
for (const tk of kicks) {
  const s0 = Math.round(tk * SR), n = Math.round(0.3 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const g = 1 - 0.25 * Math.exp(-i / SR / 0.1);
    MUSIC[0][s0 + i] *= g; MUSIC[1][s0 + i] *= g;
  }
}
}

// ── Locución (<voiceDir>/lines.json, generado por voice.mjs) ────────────────────
// La voz se coloca en su segundo exacto; música y efectos se apartan mientras habla (ducking suave).
const VOICE = new Float32Array(N);
const duck = new Float32Array(N);              // 0 = sin voz, 1 = voz activa (suavizado)
const voiceManifest = path.join(here, video.voiceDir, 'lines.json');
if (existsSync(voiceManifest) && !SFX_ONLY) {
  const { lines } = JSON.parse(readFileSync(voiceManifest, 'utf8'));
  const active = new Uint8Array(N);
  for (const line of lines) {
    const raw = execFileSync(ffmpegPath, ['-v', 'error', '-i', path.join(here, video.voiceDir, line.file), '-af', TRIM, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
    const pcm = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
    const hp = new BQ('hp', 90);                // limpia graves de la voz para que no choque con el pad
    let e = 0; for (const v of pcm) e += v * v;
    const g = 1 / Math.sqrt(e / pcm.length);    // cada frase a RMS unitario; el nivel final se fija abajo
    const s0 = Math.round(line.t * SR);
    for (let i = 0; i < pcm.length && s0 + i < N; i++) VOICE[s0 + i] += hp.p(pcm[i]) * g;
    for (let k = Math.max(0, s0 - Math.round(0.08 * SR)); k < Math.min(N, s0 + pcm.length); k++) active[k] = 1;
  }
  // envolvente de ducking: ataque 0.15 s, liberación 0.6 s
  const att = 1 - Math.exp(-1 / (0.15 * SR)), rel = 1 - Math.exp(-1 / (0.6 * SR));
  let d = 0;
  for (let k = 0; k < N; k++) { d += (active[k] - d) * (active[k] > d ? att : rel); duck[k] = d; }
  // nivel de voz relativo a la música en los tramos hablados: ~7 dB por encima (≈9 dB con música grabada, más densa)
  let em = 0, ev = 0, n = 0;
  for (let k = 0; k < N; k++) if (active[k]) { const m = (MUSIC[0][k] + KICK[0][k]) * 0.5; em += m * m; ev += VOICE[k] * VOICE[k]; n++; }
  // window.MUSIC.track.under: dB extra que la música queda por debajo (música de fondo discreta)
  const vGain = n ? (Math.sqrt(em / n) * 0.5 * (useTrack ? 2.8 * Math.pow(10, (M.track.under ?? 0) / 20) : 2.24)) / Math.sqrt(ev / n) : 0;
  for (let k = 0; k < N; k++) VOICE[k] *= vGain;
  // un toque de sala para integrarla con la mezcla
  for (let k = 0; k < N; k++) { VERB[0][k] += VOICE[k] * 0.04; VERB[1][k] += VOICE[k] * 0.04; }
  console.log(`✔ locución: ${lines.length} frases mezcladas`);
}

// ── Mezcla automática de efectos por prominencia ───────────────────────────
// Cada efecto grabado se ajusta para sobresalir `target` dB sobre la cama (música + voz) en ±150 ms de su pico.
// Solo se atenúa (nunca supera la ganancia de sounds.mjs): así un whoosh no "estalla" sobre una intro suave.
const duckM = k => 1 - (useTrack ? M.track.duck ?? 0.6 : 0.5) * duck[k], duckS = k => 1 - 0.25 * duck[k];
for (const ev of EVENTS) {
  const W = Math.round(0.15 * SR), a = Math.max(0, ev.peakAt - W), b = Math.min(N, ev.peakAt + W);
  let be = 0; for (let k = a; k < b; k++) { const m = (MUSIC[0][k] + KICK[0][k]) * duckM(k) + VOICE[k]; be += m * m; }
  const bed = Math.sqrt(be / Math.max(1, b - a)) || 1e-4;
  // pico efectivo tal como sonará: con el 0.9 del bus y la atenuación de efectos bajo la voz
  let pk = 0; for (let i = 0; i < ev.data.length; i++) { const k = ev.start + i; if (k >= 0 && k < N) pk = Math.max(pk, Math.abs(ev.data[i] * 0.9 * duckS(k))); }
  // sin música ni voz no hay cama que medir: cada efecto suena a su ganancia de sounds.mjs
  ev.scale = SFX_ONLY ? 1 : Math.min(1, bed * Math.pow(10, ev.target / 20) / (pk || 1));
  for (let i = 0; i < ev.data.length; i++) {
    const k = ev.start + i; if (k < 0 || k >= N) continue;
    const v = ev.data[i] * ev.scale;
    SFX[0][k] += v; SFX[1][k] += v; VERB[0][k] += v * 0.08; VERB[1][k] += v * 0.08;
  }
}

// ── Reverb (Freeverb reducido) ─────────────────────────────────────────────
function reverb(input, spread) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491].map(d => ({ buf: new Float32Array(d + spread), i: 0, store: 0 }));
  const aps = [556, 441, 341].map(d => ({ buf: new Float32Array(d + spread), i: 0 }));
  const out = new Float32Array(N), fb = 0.84, damp = 0.4;
  for (let k = 0; k < N; k++) {
    const x = input[k] * 0.015; let y = 0;
    for (const c of combs) { const o = c.buf[c.i]; c.store = o * (1 - damp) + c.store * damp; c.buf[c.i] = x + c.store * fb; c.i = (c.i + 1) % c.buf.length; y += o; }
    for (const a of aps) { const o = a.buf[a.i]; a.buf[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.buf.length; y = o - y; }
    out[k] = y;
  }
  return out;
}
const RV = [reverb(VERB[0], 0), reverb(VERB[1], 23)];

// ── Mezcla y master ─────────────────────────────────────────────────────────
// Nivel final: -14 LUFS integrados, techo -1.5 dBTP (rango recomendado para Reels/TikTok), con loudnorm de 2 pasadas.
const LUFS = -14, TRUE_PEAK = -1.5;
const L = new Float32Array(N), R = new Float32Array(N);
let peak = 0;
for (let k = 0; k < N; k++) {
  const t = k / SR, fade = t > DUR - 0.8 ? Math.max(0, (DUR - t) / 0.8) : 1;
  // bajo la voz: música -6 dB (-8 dB si es grabada) y efectos -2.5 dB
  const dm = 1 - (useTrack ? 0.6 : 0.5) * duck[k], ds = 1 - 0.25 * duck[k];
  L[k] = ((MUSIC[0][k] + KICK[0][k]) * dm + SFX[0][k] * 0.9 * ds + RV[0][k] * 2 + VOICE[k]) * fade;
  R[k] = ((MUSIC[1][k] + KICK[1][k]) * dm + SFX[1][k] * 0.9 * ds + RV[1][k] * 2 + VOICE[k]) * fade;
  peak = Math.max(peak, Math.abs(L[k]), Math.abs(R[k]));
}
// --report: cuánto sobresale cada efecto (pico en ±150 ms) sobre la "cama" de música + voz (RMS en esa ventana).
// Referencia: transiciones a ~50–70 % del volumen de la voz; un efecto que sobresale > 6 dB se percibe invasivo.
if (process.argv.includes('--report')) {
  const W = Math.round(0.15 * SR), rows = [];
  for (const c of cues) {
    const c0 = Math.max(0, Math.round(c.t * SR) - W), c1 = Math.min(N, Math.round(c.t * SR) + W);
    let sp = 0, be = 0;
    for (let k = c0; k < c1; k++) {
      const ds = 1 - 0.25 * duck[k], dm = 1 - (useTrack ? 0.6 : 0.5) * duck[k];
      sp = Math.max(sp, Math.abs(SFX[0][k] * 0.9 * ds));
      const b = (MUSIC[0][k] + KICK[0][k]) * dm + VOICE[k]; be += b * b;
    }
    rows.push({ t: c.t, tipo: c.type, 'sobresale dB': +(20 * Math.log10(sp / Math.sqrt(be / (c1 - c0) + 1e-12))).toFixed(1) });
  }
  console.table(rows);
}
// ganancia por RMS (no por pico) para un nivel estable; limitador suave solo en los picos
let e = 0; for (let k = 0; k < N; k++) e += L[k] * L[k] + R[k] * R[k];
const rms = Math.sqrt(e / (2 * N)), norm = 0.135 / rms;
const soft = x => (Math.abs(x) < 0.75 ? x : Math.sign(x) * (0.75 + 0.14 * Math.tanh((Math.abs(x) - 0.75) / 0.14)));  // techo ≈ -1 dBFS
const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 4, 40);
for (let k = 0; k < N; k++) {
  wav.writeInt16LE(Math.round(clamp(soft(L[k] * norm), -1, 1) * 32767), 44 + k * 4);
  wav.writeInt16LE(Math.round(clamp(soft(R[k] * norm), -1, 1) * 32767), 46 + k * 4);
}
// loudnorm en 2 pasadas: medir y aplicar ganancia lineal hasta el objetivo sin pasar el techo
const pre = path.join(here, video.soundtrack.replace(/\.wav$/, '.pre.wav'));
writeFileSync(pre, wav);
const ln = `loudnorm=I=${LUFS}:TP=${TRUE_PEAK}:LRA=11`;
// pasada 1: loudnorm imprime las medidas en JSON por stderr
const pass1 = spawnSync(ffmpegPath, ['-nostdin', '-hide_banner', '-i', pre, '-af', `${ln}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
const meas = JSON.parse(pass1.stderr.slice(pass1.stderr.lastIndexOf('{')));
execFileSync(ffmpegPath, ['-nostdin', '-v', 'error', '-y', '-i', pre, '-af',
  `${ln}:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`,
  '-ar', String(SR), '-c:a', 'pcm_s16le', path.join(here, video.soundtrack)]);
rmSync(pre);
console.log(`✔ ${video.soundtrack} — ${DUR}s, ${cues.length} efectos, ${meas.input_i} → ${LUFS} LUFS`);
