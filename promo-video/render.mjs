// Renderiza index.html fotograma a fotograma (GSAP timeline.seek) y lo codifica con ffmpeg.
//   node render.mjs                 → anisanar-lanzamiento.mp4 (requiere soundtrack.wav: node audio.mjs)
//   node render.mjs --stills 1,5.2  → frames/still-*.png para revisión rápida
//   node render.mjs --cues          → solo exporta cues.json (sincronía del audio)
import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] ?? true); };

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 600000,
  args: ['--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, 'index.html')).href, { waitUntil: 'load', timeout: 120000 });

// Esperar fuentes e imágenes de fondo (CSS background-image) antes del primer frame
await page.evaluate(async () => {
  await document.fonts.ready;
  const urls = new Set();
  document.querySelectorAll('*').forEach(el => {
    const m = getComputedStyle(el).backgroundImage.match(/url\("?(https?:[^")]+)"?\)/);
    if (m) urls.add(m[1]);
  });
  document.querySelectorAll('img').forEach(i => urls.add(i.src));
  await Promise.all([...urls].map(u => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = u; setTimeout(r, 15000); })));
});

const { cues, duration } = await page.evaluate(() => ({ cues: window.CUES, duration: window.DURATION }));
writeFileSync(path.join(here, 'cues.json'), JSON.stringify({ duration, cues }, null, 1));
console.log(`cues.json: ${cues.length} eventos de sonido, duración ${duration}s`);

if (flag('--cues')) { await browser.close(); process.exit(0); }

const stills = flag('--stills');
if (stills) {
  mkdirSync(path.join(here, 'frames'), { recursive: true });
  for (const t of String(stills).split(',').map(Number)) {
    // recorrer en orden desde 0 para que los tweens "to" capturen su estado inicial
    for (let s = 0; s < t; s += 0.5) { const c = Date.now(); await page.evaluate(x => window.__seek(x), s); if (args.includes("--debug")) console.log("seek", s, Date.now() - c); }
    await page.evaluate(x => window.__seek(x), t);
    await page.screenshot({ path: path.join(here, 'frames', `still-${t.toFixed(2)}.png`) });
    console.log('still', t);
  }
  await browser.close();
  process.exit(0);
}

const audio = path.join(here, 'soundtrack.wav');
const out = path.join(here, flag('--out') || 'anisanar-lanzamiento.mp4');
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
  await page.evaluate(x => window.__seek(x), f / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 60 === 0) process.stdout.write(`\rframe ${f}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
const code = await new Promise(r => ff.on('close', r));
await browser.close();
if (code !== 0) { console.error(ffErr.slice(-3000)); process.exit(code); }
console.log(`\n✔ ${out}`);
