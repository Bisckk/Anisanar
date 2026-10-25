// Sintetiza la banda sonora completa (música + efectos) en soundtrack.wav.
// Los efectos se colocan desde cues.json, exportado por la misma timeline GSAP (node render.mjs --cues),
// así cada sonido cae en el frame exacto de su animación.
// Paleta: cálida y sutil — pad redondo, marimba, pulso discreto; efectos de "aire" y campanas suaves.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import { TRIM } from './voice.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const cuesPath = path.join(here, 'cues.json');
// siempre regenerar los cues para que el audio siga a la timeline actual
execFileSync(process.execPath, [path.join(here, 'render.mjs'), '--cues'], { stdio: 'inherit' });
const { duration: DUR, cues } = JSON.parse(readFileSync(cuesPath, 'utf8'));

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
for (const c of cues) (FX[c.type] || (() => console.warn('cue sin sonido:', c.type)))(c);

// ── Música: 120 BPM, Cmaj7–Am7–Fmaj7–G, grid alineado con el logo ───────────
const BEAT = 0.5, T0 = 0.62;                 // beat 8 = 4.62s (logo), 71 ≈ 36.12, 93 ≈ 47.12 (cierre)
const beatT = b => T0 + b * BEAT;
const CH = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67]];
const ROOT = [36, 33, 41, 43];
const DROP = beatT(8), BREAK_IN = 45.4, FINAL = beatT(93), END = 52.6;
const OUT_A = beatT(70), OUT_B = beatT(71);  // pausa de un beat antes de la escena de beneficios
const playing = t => (t >= DROP && t < BREAK_IN && !(t >= OUT_A && t < OUT_B)) || (t >= FINAL && t < END);
const kicks = [];

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
  // marimba: arpegio en corcheas desde la web hasta el final de reseñas
  if (t >= 8.6 && t < BREAK_IN + 1 && !(t >= OUT_A && t < OUT_B)) {
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

// ── Locución (voice/lines.json, generado por voice.mjs) ────────────────────
// La voz se coloca en su segundo exacto; música y efectos se apartan mientras habla (ducking suave).
const VOICE = new Float32Array(N);
const duck = new Float32Array(N);              // 0 = sin voz, 1 = voz activa (suavizado)
const voiceManifest = path.join(here, 'voice', 'lines.json');
if (existsSync(voiceManifest)) {
  const { lines } = JSON.parse(readFileSync(voiceManifest, 'utf8'));
  const active = new Uint8Array(N);
  for (const line of lines) {
    const raw = execFileSync(ffmpegPath, ['-v', 'error', '-i', path.join(here, 'voice', line.file), '-af', TRIM, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
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
  // nivel de voz relativo a la música en los tramos hablados: ~7 dB por encima
  let em = 0, ev = 0, n = 0;
  for (let k = 0; k < N; k++) if (active[k]) { const m = (MUSIC[0][k] + KICK[0][k]) * 0.5; em += m * m; ev += VOICE[k] * VOICE[k]; n++; }
  const vGain = n ? (Math.sqrt(em / n) * 0.5 * 2.24) / Math.sqrt(ev / n) : 0;
  for (let k = 0; k < N; k++) VOICE[k] *= vGain;
  // un toque de sala para integrarla con la mezcla
  for (let k = 0; k < N; k++) { VERB[0][k] += VOICE[k] * 0.04; VERB[1][k] += VOICE[k] * 0.04; }
  console.log(`✔ locución: ${lines.length} frases mezcladas`);
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

// ── Mezcla y master (objetivo ≈ -16 LUFS, sin saturar) ─────────────────────
const L = new Float32Array(N), R = new Float32Array(N);
let peak = 0;
for (let k = 0; k < N; k++) {
  const t = k / SR, fade = t > DUR - 0.8 ? Math.max(0, (DUR - t) / 0.8) : 1;
  const dm = 1 - 0.5 * duck[k], ds = 1 - 0.25 * duck[k];   // música -6 dB, efectos -2.5 dB bajo la voz
  L[k] = ((MUSIC[0][k] + KICK[0][k]) * dm + SFX[0][k] * 0.9 * ds + RV[0][k] * 2 + VOICE[k]) * fade;
  R[k] = ((MUSIC[1][k] + KICK[1][k]) * dm + SFX[1][k] * 0.9 * ds + RV[1][k] * 2 + VOICE[k]) * fade;
  peak = Math.max(peak, Math.abs(L[k]), Math.abs(R[k]));
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
writeFileSync(path.join(here, 'soundtrack.wav'), wav);
console.log(`✔ soundtrack.wav — ${DUR}s, ${cues.length} efectos`);
