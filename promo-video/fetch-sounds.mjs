// Descarga los efectos y la música de sounds.mjs en sounds/ (no se versionan: ver licencia en sounds.mjs).
//   node fetch-sounds.mjs
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SFX, MUSIC, LIB_DIR, sfxUrl, musicUrl, sfxFile, musicFile } from './sounds.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sounds');
mkdirSync(dir, { recursive: true });
const ids = new Set(Object.values(SFX).flatMap(s => [s.id, s.alt, ...(s.ids ?? [])].filter(Boolean)));
const here = path.dirname(fileURLToPath(import.meta.url));
for (const id of [...ids].filter(i => String(i).startsWith('lib-'))) copyFileSync(path.join(here, LIB_DIR, `${id.slice(4)}.mp3`), path.join(dir, sfxFile(id)));
const jobs = [...[...ids].filter(i => !String(i).startsWith('lib-')).map(id => [sfxUrl(id), sfxFile(id)]), ...Object.keys(MUSIC).map(id => [musicUrl(id), musicFile(id)])];
let got = 0;
for (const [url, file] of jobs) {
  const out = path.join(dir, file);
  if (existsSync(out)) { got++; continue; }
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) { console.error(`✖ ${file}: HTTP ${res.status}`); continue; }
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  got++; console.log(`↓ ${file}`);
}
console.log(`✔ sounds/: ${got}/${jobs.length} archivos`);
