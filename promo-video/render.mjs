// Renderiza una composición HTML fotograma a fotograma (GSAP timeline.seek) y la codifica con ffmpeg.
//   node render.mjs [video]                → <out>.mp4 (requiere soundtrack-<video>.wav: node audio.mjs [video])
//   node render.mjs [video] --stills 1,5.2 → frames/<video>-*.png para revisión rápida
//   node render.mjs [video] --cues         → solo exporta cues-<video>.json (sincronía del audio)
// La página define window.__seek(t) (puede devolver una promesa si hay <video> que posicionar),
// window.DURATION, window.CUES y opcionalmente window.STAGE {w,h} y window.MUSIC.
import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { pickVideo } from './videos.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] ?? true); };
const video = pickVideo(args);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 600000,
  args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, video.page)).href, { waitUntil: 'load', timeout: 120000 });
const stage = await page.evaluate(() => window.STAGE || { w: 1920, h: 1080 });
await page.setViewport({ width: stage.w, height: stage.h, deviceScaleFactor: 1 });

// Esperar fuentes, imágenes de fondo (CSS background-image) y videos antes del primer frame
await page.evaluate(async () => {
  await document.fonts.ready;
  const urls = new Set();
  document.querySelectorAll('*').forEach(el => {
    for (const m of getComputedStyle(el).backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)) if (!m[1].startsWith('data:')) urls.add(m[1]);
  });
  document.querySelectorAll('img').forEach(i => urls.add(i.src));
  await Promise.all([...urls].map(u => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = u; setTimeout(r, 15000); })));
  await Promise.all([...document.querySelectorAll('video')].map(v => v.readyState >= 2 ? 0 :
    new Promise(r => { v.addEventListener('loadeddata', r, { once: true }); v.addEventListener('error', r, { once: true }); setTimeout(r, 15000); })));
});

const { cues, duration, music } = await page.evaluate(() => ({ cues: window.CUES, duration: window.DURATION, music: window.MUSIC || null }));
writeFileSync(path.join(here, video.cues), JSON.stringify({ duration, music, cues }, null, 1));
console.log(`${video.cues}: ${cues.length} eventos de sonido, duración ${duration}s`);

if (flag('--cues')) { await browser.close(); process.exit(0); }

const seek = t => page.evaluate(async x => { await window.__seek(x); }, t);

const stills = flag('--stills');
if (stills) {
  mkdirSync(path.join(here, 'frames'), { recursive: true });
  for (const t of String(stills).split(',').map(Number)) {
    // recorrer en orden desde 0 para que los tweens "to" capturen su estado inicial
    for (let s = 0; s < t; s += 0.5) await seek(s);
    await seek(t);
    const file = path.join(here, 'frames', `${video.id}-${t.toFixed(2)}.png`);
    await page.screenshot({ path: file });
    console.log('still', file);
  }
  await browser.close();
  process.exit(0);
}

// --sfx-only: usa la pista de solo efectos (node audio.mjs <video> --sfx-only) → <out>-solo-efectos.mp4
const sfxOnly = args.includes('--sfx-only');
const audio = path.join(here, sfxOnly ? video.soundtrack.replace(/\.wav$/, '-sfx.wav') : video.soundtrack);
const out = path.join(here, flag('--out') || (sfxOnly ? video.out.replace(/(-vertical)?\.mp4$/, '-solo-efectos.mp4') : video.out));
const ff = spawn(ffmpegPath, [
  '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  ...(existsSync(audio) ? ['-i', audio, '-c:a', 'aac', '-b:a', '256k'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  '-shortest', out,
], { stdio: ['pipe', 'inherit', 'pipe'] });
let ffErr = '';
ff.stderr.on('data', d => { ffErr += d; });

const total = Math.round(duration * FPS);
const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await seek(f / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 60 === 0) process.stdout.write(`\rframe ${f}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
const code = await new Promise(r => ff.on('close', r));
await browser.close();
if (code !== 0) { console.error(ffErr.slice(-3000)); process.exit(code); }
console.log(`\n✔ ${out}`);
