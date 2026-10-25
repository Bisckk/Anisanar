// Genera el reel como composición HyperFrames: index.html (raíz, audio) + compositions/s1…s9.html.
// Fuente de verdad: los tiempos de la voz (assets/voice/words.json) y SPEC.md. Todo lo temporizado queda escrito en el
// HTML con id estable (editable en la app de HyperFrames). Después aplica el tratamiento de color oficial a los fondos.
//   node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = JSON.parse(readFileSync(path.join(root, 'assets/voice/words.json'), 'utf8'));
const PEAKS = JSON.parse(readFileSync(path.join(root, 'assets/sfx/peaks.json'), 'utf8'));
const DUR = 33.5;
const t = i => W[i].start;                                  // inicio de la palabra i (s absolutos)
const r3 = x => Math.round(x * 1000) / 1000;
const clean = s => s.replace(/[¿?,.:]/g, '');

// ── Escenas (segundos absolutos) ──────────────────────────────────────────
const SCENES = [
  { id: 's1', start: 0, end: 3.4 }, { id: 's2', start: 3.4, end: 6.1 }, { id: 's3', start: 6.1, end: 10.5 },
  { id: 's4', start: 10.5, end: 15.45 }, { id: 's5', start: 15.45, end: 17.4 }, { id: 's6', start: 17.4, end: 20.7 },
  { id: 's7', start: 20.7, end: 24.05 }, { id: 's8', start: 24.05, end: 28.05 }, { id: 's9', start: 28.05, end: DUR },
];
const S = Object.fromEntries(SCENES.map(s => [s.id, s]));

// ── Piezas comunes de cada escena ─────────────────────────────────────────
const CSS = `
  #root { position: absolute; inset: 0; overflow: hidden; background: #0b151d; font-family: Montserrat, sans-serif; color: #fff; }
  .cam { position: absolute; inset: 0; transform-origin: 50% 45%; }
  .bg-media { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; object-fit: cover; }
  .line { position: absolute; left: 60px; width: 960px; text-align: center; line-height: 1.02; }
  .w { display: inline-block; opacity: 0; margin: 0 0.12em; text-shadow: 0 4px 24px rgba(0,0,0,.8), 0 0 3px rgba(0,0,0,.6); }
  .sm { font: 700 66px/1.1 Montserrat, sans-serif; letter-spacing: -0.01em; }
  .serif { font: italic 900 92px/1.05 'Playfair Display', serif; }
  .em { font: 900 220px/0.92 Montserrat, sans-serif; letter-spacing: -0.04em; text-transform: uppercase; color: #8CC63F; display: block; margin: 0.04em 0; }
  .em.white { color: #fff; }
  .em.teal { color: #2BAABC; }
  .mono { font: 700 210px/1 'Space Mono', monospace; letter-spacing: -0.04em; }
  .ch { display: inline-block; }
  [data-slam] { position: relative; }
  .echo { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; opacity: 0; pointer-events: none;
          color: transparent !important; -webkit-text-stroke: 3px rgba(255,255,255,.85); text-shadow: none !important; }
  .echo * { color: transparent !important; text-shadow: none !important; }
`;
// fondo: media temporizada dentro de una cámara (la cámara se mueve, nunca la media)
const bgImg = (sc, src, pos = '50% 50%', id = `${sc}-bg`) =>
  `<div class="cam" id="${sc}-cam" data-layout-allow-overflow><img id="${id}" class="clip bg-media" data-start="0" data-duration="${r3(S[sc].end - S[sc].start)}" src="${src}" style="object-position:${pos}" alt=""></div>`;
const bgVid = (sc, src, mediaStart = 0, pos = '50% 50%') =>
  `<div class="cam" id="${sc}-cam" data-layout-allow-overflow><video id="${sc}-bg" class="clip bg-media" data-start="0" data-duration="${r3(S[sc].end - S[sc].start)}" data-media-start="${mediaStart}" src="${src}" style="object-position:${pos}" muted playsinline></video></div>`;

const TICKS = [];   // instantes (s absolutos) en que se escribe una palabra conectora → tecleo suave
// línea de palabras sincronizada con la voz. words: índices; emph: índices que golpean (slam)
function line(sc, id, words, top, { cls = 'sm', emph = [], emphCls = '', end, html } = {}) {
  const s0 = S[sc].start;
  const start = r3(Math.max(0, t(words[0]) - s0 - 0.05));
  const stop = r3((end ?? S[sc].end) - s0);
  const body = html ?? words.map(i => {
    const e = emph.includes(i);
    if (!e) TICKS.push(t(i));
    return `<span class="w ${e ? `em ${emphCls}` : cls}" id="${sc}-w${i}" data-t="${r3(t(i) - s0)}"${e ? ' data-slam="1"' : ''}>${e ? clean(W[i].text) : W[i].text}</span>`;
  }).join('');
  return `<div class="line clip" id="${sc}-${id}" data-start="${start}" data-duration="${r3(stop - start)}" style="top:${top}px" data-layout-allow-overlap>${body}</div>`;
}

// JS común: las conectoras aparecen (blur→0) en su tiempo. Las de énfasis golpean LETRA A LETRA: cada letra gira desde
// abajo en 3D con desenfoque, la palabra entera se asienta desde 1.25, separación RGB que cae, un eco de contorno que se
// expande y se apaga, y la cámara hace punch-in con una sacudida de 4 frames.
const JS = (sc, extra = '') => `
  const tl = gsap.timeline({ paused: true });
  const RGB0 = '-14px 0 rgba(255,40,140,0.85), 14px 0 rgba(40,220,255,0.85), 0 6px 30px rgba(0,0,0,0.6)';
  const RGB1 = '0px 0 rgba(255,40,140,0), 0px 0 rgba(40,220,255,0), 0 6px 30px rgba(0,0,0,0.6)';
  const cam = document.querySelector('#${sc}-cam');
  const split = el => { const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) { const fr = document.createDocumentFragment();
        [...c.textContent].forEach(ch => { const sp = document.createElement('span'); sp.className = 'ch'; sp.textContent = ch; fr.appendChild(sp); });
        c.replaceWith(fr); } else walk(c); });
    walk(el); return [...el.querySelectorAll('.ch')]; };
  let punch = 1;
  [...document.querySelectorAll('#root .w')].forEach(el => {
    const at = +el.dataset.t;
    if (el.dataset.slam) {
      const echo = el.cloneNode(true); echo.removeAttribute('id'); echo.removeAttribute('data-slam'); echo.classList.add('echo'); echo.style.rotate = '0deg'; echo.setAttribute('aria-hidden', 'true'); echo.setAttribute('data-layout-ignore', '');
      const chars = split(el); el.appendChild(echo); el.setAttribute('data-layout-ignore', '');   // (ya verificada a ojo: el lector de texto cuenta cada letra como palabra)
      tl.set(el, { opacity: 1 }, at);
      const st = Math.min(0.03, 0.3 / chars.length), land = at + st * chars.length + 0.12;   // el eco sale cuando ya aterrizó la última letra
      tl.fromTo(chars, { opacity: 0, yPercent: 90, rotationX: -85, transformPerspective: 700, filter: 'blur(10px)' },
        { opacity: 1, yPercent: 0, rotationX: 0, filter: 'blur(0px)', duration: 0.34, ease: 'expo.out', stagger: st }, at);
      tl.fromTo(el, { scale: 1.25, textShadow: RGB0 }, { scale: 1, duration: 0.45, ease: 'expo.out', immediateRender: false }, at);
      tl.to(el, { textShadow: RGB1, duration: 0.3, ease: 'power2.out' }, at + 0.08);
      tl.fromTo(echo, { opacity: 0.6, scale: 1 }, { opacity: 0, scale: 1.35, duration: 0.5, ease: 'power2.out', immediateRender: false }, land);
      if (cam && at > 0.3) {
        punch += 0.045;
        tl.to(cam, { scale: punch, duration: 0.35, ease: 'power3.out' }, at);
        tl.to(cam, { keyframes: [{ x: -12, y: 6, duration: 0.033 }, { x: 9, y: -5, duration: 0.033 }, { x: -5, y: 3, duration: 0.033 }, { x: 0, y: 0, duration: 0.05 }] }, at);
      }
    } else {
      tl.fromTo(el, { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.13, ease: 'power4.out' }, at);
    }
  });
  // salida de cada línea: blur-out + fade de 0.15 s al final de su ventana
  document.querySelectorAll('#root .line').forEach(ln => {
    const end = +ln.dataset.start + +ln.dataset.duration;
    tl.to(ln.querySelectorAll('.w:not(.echo)'), { opacity: 0, filter: 'blur(8px)', duration: 0.15, ease: 'power2.in' }, end - 0.16);
  });
  ${extra}
  window.__timelines["${sc}"] = tl;`;

function scene(sc, inner, extra = '', css = '') {
  const s = S[sc];
  return `<template>
  <style>${CSS}${css}</style>
  <div id="root" data-composition-id="${sc}" data-width="1080" data-height="1920" data-start="0" data-duration="${r3(s.end - s.start)}">
    ${inner}
  </div>
  <script>${JS(sc, extra)}
  </script>
</template>
`;
}

// Transiciones (cada una con causa en pantalla): barrido = la cámara se va desenfocada en una dirección y la siguiente
// escena llega desde la opuesta; con escala 1.5 el desplazamiento de 300 px nunca deja ver el fondo vacío.
const whipOut = (sc, dir, d = 0.2) => { const [k, v] = dir === 'up' ? ['y', -300] : ['x', -300];
  return `tl.to('#${sc}-cam', { ${k}: ${v}, scale: 1.5, filter: 'blur(30px)', duration: ${d}, ease: 'power3.in' }, ${r3(S[sc].end - S[sc].start - d)});`; };
const whipIn = (sc, dir, to = 1) => { const k = dir === 'up' ? 'y' : 'x';
  return `tl.fromTo('#${sc}-cam', { ${k}: 300, scale: 1.5, filter: 'blur(30px)' }, { ${k}: 0, scale: ${to}, filter: 'blur(0px)', duration: 0.24, ease: 'expo.out' }, 0);`; };

const files = {};

// S1 · HOOK — perro real · "¿qué tiene mi PERRO?" → "esa es la pregunta EQUIVOCADA"
files.s1 = scene('s1', `
    ${bgVid('s1', 'assets/video/video-mascota-feliz.mp4', 8.3)}
    ${line('s1', 'l1', [0, 1, 2, 3], 330, { emph: [3], end: 1.45 })}
    ${line('s1', 'l2', [4, 5, 6, 7, 8], 330, { emph: [8], emphCls: 'long' })}`,
  `tl.fromTo('#s1-cam', { scale: 1.04 }, { scale: 1.04, duration: 0.01 }, 0);
   // EQUIVOCADA: glitch breve (3 frames de desplazamiento)
   const eq = '#s1-w8'; const g0 = ${r3(t(8))};
   [[8, 0], [-10, 0.033], [5, 0.066], [0, 0.1]].forEach(([x, d]) => tl.set(eq, { x }, g0 + 0.02 + d));
   ${whipOut('s1', 'left')}`,
  `.em.long { font-size: 132px; }`);

// S2 · LA PREGUNTA — equipo quirúrgico real · "la pregunta es: ¿quién lo va a CUIDAR?" → zoom-through
files.s2 = scene('s2', `
    ${bgImg('s2', 'assets/img/hero-equipo-veterinario.jpg', '42% 50%')}
    ${line('s2', 'l1', [9, 10, 11], 380)}
    ${line('s2', 'l2', [12, 13, 14, 15], 520, { cls: 'serif' })}
    ${line('s2', 'l3', [16], 660, { emph: [16] })}`,
  `${whipIn('s2', 'left', 1.06)}
   // zoom-through hacia la puerta: todo acelera hacia cámara
   tl.to('#root', { scale: 2.2, filter: 'blur(14px)', opacity: 0, duration: 0.18, ease: 'power3.in' }, ${r3(S.s2.end - S.s2.start - 0.18)});`);

// S3 · REVELACIÓN — puerta real · "en San Gil, desde 2011, la respuesta es ANISANAR" + logo
files.s3 = scene('s3', `
    ${bgVid('s3', 'assets/video/video-entrada-clinica.mp4', 0.2)}
    ${line('s3', 'l1', [17, 18, 19], 360, { end: 8.38 })}
    ${line('s3', 'l2', [20, 21], 470, { end: 8.38, html:
      `<span class="w sm" id="s3-w20" data-t="${r3(t(20) - S.s3.start)}">desde</span><br><span class="w mono" id="s3-w21" data-t="${r3(t(21) - S.s3.start)}"><span id="s3-year">0000</span></span>` })}
    ${line('s3', 'l3', [22, 23, 24], 660)}
    <div class="clip" id="s3-logo" data-start="${r3(t(25) - S.s3.start - 0.05)}" data-duration="${r3(S.s3.end - t(25) + 0.05)}" style="position:absolute;left:390px;top:300px;width:300px;height:300px">
      <div id="s3-logo-card" style="width:300px;height:300px;border-radius:78px;background:#fff;display:grid;place-items:center;box-shadow:0 30px 80px rgba(0,0,0,.5)"><img src="assets/img/logo-anisanar.png" style="width:220px" alt=""></div>
    </div>
    ${line('s3', 'l4', [25], 750, { html: `<span class="w em white" id="s3-w25" data-t="${r3(t(25) - S.s3.start)}" data-slam="1" style="font-size:176px">ANIS<span style="color:#2BAABC">ANAR</span></span>` })}`,
  `tl.fromTo('#s3-cam', { scale: 1.25, filter: 'blur(12px)' }, { scale: 1.0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, 0);
   tl.to('#s3-cam', { scale: 1.08, duration: 3.6, ease: 'power1.inOut' }, 0.6);
   // contador del año: gira hasta 2011 justo cuando la voz dice "2011"
   const y = document.getElementById('s3-year'), y0 = ${r3(t(21) - S.s3.start)};
   ['1990','1996','2002','2007','2011'].forEach((v, i) => tl.set(y, { textContent: v }, y0 + i * 0.06));   // (tics en el plan de sonido)
   tl.fromTo('#s3-logo-card', { scale: 0, rotation: -40, rotationY: 180, transformPerspective: 900 }, { scale: 1, rotation: 0, rotationY: 0, duration: 0.6, ease: 'back.out(1.6)' }, ${r3(t(25) - S.s3.start)});`);

// S4 · SERVICIOS — corte seco en cada palabra, una foto real y un layout distinto por servicio
const SVC = [
  { w: 26, img: 'servicio-nutricion-clinica.jpg', pos: '50% 30%', top: 300, rot: -5, size: 170 },
  { w: 27, img: 'gallery-microcirugia-ocular.webp', pos: '50% 40%', top: 900, rot: 0, size: 200 },
  { w: 28, img: 'servicio-diagnostico-imagen.jpg', pos: '30% 50%', top: 420, rot: 4, size: 122 },
  { w: 29, img: 'gallery-carino-cachorro.webp', pos: '55% 40%', top: 380, rot: -3, size: 84 },
  { w: 31, img: 'gallery-fisioterapia-pelota.webp', pos: '50% 40%', top: 300, rot: 3, size: 120 },
];
{
  const s0 = S.s4.start, sc = 's4';
  const cuts = SVC.map(v => r3(t(v.w) - s0));
  const shots = SVC.map((v, i) => {
    const st = i === 0 ? 0 : cuts[i], du = r3((i < SVC.length - 1 ? cuts[i + 1] : S.s4.end - s0) - st);
    const word = clean(W[v.w].text).toUpperCase();
    const text = word;
    return `<div class="clip shot" id="s4-shot${i}" data-start="${st}" data-duration="${du}">
      <div class="cam" id="s4-cam${i}" data-layout-allow-overflow><img id="s4-bg${i}" class="bg-media" src="assets/img/${v.img}" style="object-position:${v.pos}" alt=""></div>
      <div class="svc-word" id="s4-word${i}" data-t="${cuts[i]}" style="top:${v.top}px;font-size:${v.size}px;transform:none" data-layout-allow-overlap><span class="svc-in w" id="s4-in${i}" data-t="${cuts[i]}" data-slam="1" style="rotate:${v.rot}deg">${text}</span></div>
    </div>`;
  }).join('');
  const dip = `<div class="clip" id="s4-dip" data-start="${r3(S.s4.end - s0 - 0.1)}" data-duration="0.1" style="position:absolute;inset:0;background:#000;opacity:.45"></div>`;
  files.s4 = scene('s4', shots + dip, `
   ${SVC.map((v, i) => `
   tl.fromTo('#s4-cam${i}', { scale: 1.16 }, { scale: 1.04, duration: 0.9, ease: 'expo.out' }, ${cuts[i]});`).join('')}`,
  `.shot { position: absolute; inset: 0; overflow: hidden; }
   .svc-word { position: absolute; left: 40px; width: 1000px; text-align: center; font-weight: 900; letter-spacing: -0.04em; line-height: .9; color: #8CC63F; text-shadow: 0 6px 30px rgba(0,0,0,.6); }
   .svc-in { display: inline-block; margin: 0; white-space: nowrap; text-shadow: 0 6px 30px rgba(0,0,0,.6); }`);
}

// S5 · TECHO — fachada real · "todo bajo UN MISMO TECHO" → whip vertical
files.s5 = scene('s5', `
    ${bgImg('s5', 'assets/img/gallery-fachada-clinica.webp', '50% 40%')}
    ${line('s5', 'l1', [32, 33], 400)}
    ${line('s5', 'l2', [34, 35, 36], 520, { emph: [34, 35, 36], emphCls: 'techo' })}`,
  whipOut('s5', 'up'),
  `#s5-w34, #s5-w35 { color: #fff; font-size: 150px; display: inline-block; margin: 0 0.14em; } #s5-w36 { font-size: 250px; }`);

// S6 · EQUIPO — NUEVE + cuadrícula 3×3 de caras reales → FAMILIA
const TEAM = ['maria-jose-acevedo', 'juan-jose-rueda', 'luis-martinez', 'daniela-ruiz', 'carolina-martinez', 'ana-maria-villamizar', 'ximena-munoz', 'veronica-bustos', 'alexander-cely'];
files.s6 = scene('s6', `
    ${bgImg('s6', 'assets/img/hero-equipo-veterinario.jpg', '42% 50%')}
    <div class="clip" id="s6-grid" data-start="0.1" data-duration="${r3(S.s6.end - S.s6.start - 0.1)}" style="position:absolute;left:184px;top:430px;width:712px;display:grid;grid-template-columns:repeat(3,220px);gap:26px" data-layout-allow-overlap>
      ${TEAM.map((f, i) => `<div class="face" id="s6-face${i}" style="background-image:url('assets/team/${f}.webp')${i === 4 ? ';box-shadow:0 0 0 6px #8CC63F, 0 20px 40px rgba(0,0,0,.5)' : ''}"></div>`).join('')}
    </div>
    ${line('s6', 'l1', [37], 230, { emph: [37], emphCls: 'white nine', end: 17.5 + 2.2 })}
    ${line('s6', 'l2', [38], 1236, { end: t(39) - 0.03 })}
    ${line('s6', 'l2b', [39, 40, 41, 42, 43, 44], 1236)}
    ${line('s6', 'l3', [45], 700, { emph: [45], emphCls: 'fam' })}`,
  `${whipIn('s6', 'up')}
   tl.to('#s6-bg', { opacity: 0.35, duration: 0.01 }, 0);
   const faces = [...document.querySelectorAll('#s6-grid .face')];
   const order = [4, 1, 3, 5, 7, 0, 2, 6, 8];   // onda desde el centro
   order.forEach((idx, k) => tl.fromTo(faces[idx], { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }, ${r3(t(37) - S.s6.start + 0.12)} + k * 0.05));
   // FAMILIA: la cuadrícula se atenúa para que la palabra mande
   tl.to('#s6-grid', { opacity: 0.35, filter: 'blur(3px)', duration: 0.2, ease: 'power2.out' }, ${r3(t(45) - S.s6.start)});
   tl.to('#root', { filter: 'blur(10px)', opacity: 0, duration: 0.15, ease: 'power2.in' }, ${r3(S.s6.end - S.s6.start - 0.15)});`,
  `.face { height: 262px; border-radius: 24px; background: center 18%/cover; box-shadow: 0 20px 40px rgba(0,0,0,.5); opacity: 0; }
   .em.nine { font-size: 190px; } #s6-l2b .w, #s6-l2 .w { font-size: 58px; } .em.fam { font-size: 230px; }`);

// S7 · PRUEBA — golden + doctora · "por eso, 9 de cada 10 familias nos RECOMIENDAN" → mosaico
files.s7 = scene('s7', `
    ${bgImg('s7', 'assets/img/gallery-golden-dormido.webp', '50% 35%')}
    ${line('s7', 'l1', [46, 47], 330)}
    ${line('s7', 'l2', [48, 49, 50, 51], 430, { html:
      `<span class="w em" id="s7-w48" data-t="${r3(t(48) - S.s7.start)}" data-slam="1" style="font-size:420px;display:inline-block">9</span><span class="w em white" id="s7-w51" data-t="${r3(t(51) - S.s7.start)}" style="font-size:190px;display:inline-block">/10</span>` })}
    ${line('s7', 'l3', [52, 53], 900)}
    ${line('s7', 'l4', [54], 1010, { emph: [54], emphCls: 'rec' })}`,
  `tl.fromTo('#s7-cam', { scale: 1.12, filter: 'blur(10px)' }, { scale: 1.02, filter: 'blur(0px)', duration: 0.4, ease: 'expo.out' }, 0);
   ${whipOut('s7', 'left')}`,
  `.em.rec { font-size: 128px; }`);

// S8 · AGENDA — ¿AGENDAR? · celular: se teclea anisanar.com · pasa a WhatsApp · llega el mensaje · WHATSAPP
{
  const s0 = S.s8.start, url = 'anisanar.com', ty = r3(t(57) - s0), wa = r3(ty + url.length * 0.045 + 0.04), msg = r3(wa + 0.32);
  files.s8 = scene('s8', `
    ${bgVid('s8', 'assets/video/video-instalaciones-anisanar.mp4', 10.2)}
    ${line('s8', 'l1', [55], 250, { emph: [55], emphCls: 'ag', end: t(60) - 0.05 })}
    <div class="clip" id="s8-phone" data-layout-allow-overflow data-start="0.5" data-duration="${r3(S.s8.end - s0 - 0.5)}" style="position:absolute;left:260px;top:520px;width:560px;height:800px">
      <div id="s8-body" style="position:absolute;inset:0;border-radius:70px;background:#05090d;padding:16px;box-shadow:0 0 0 3px #2a3a46,0 50px 100px rgba(0,0,0,.7)">
        <div style="position:relative;width:100%;height:100%;border-radius:56px;overflow:hidden;background:#0b141a">
          <div id="s8-web" style="position:absolute;inset:0">
            <img src="assets/img/hero-equipo-veterinario.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:40% 50%" alt="">
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,16,24,.2),rgba(8,16,24,.92))"></div>
            <div style="position:absolute;left:26px;right:26px;top:36px;height:64px;border-radius:32px;background:rgba(255,255,255,.95);display:flex;align-items:center;padding:0 26px;font:600 30px 'Space Mono',monospace;color:#0b151d"><span id="s8-url"></span><span id="s8-caret" style="width:3px;height:34px;background:#2BAABC;margin-left:3px"></span></div>
            <div style="position:absolute;left:30px;bottom:150px;font:900 84px/0.95 Montserrat;letter-spacing:-0.03em">ANIS<span style="color:#2BAABC">ANAR</span></div>
            <div style="position:absolute;left:30px;bottom:60px;padding:18px 32px;border-radius:40px;background:#2BAABC;font:700 28px Montserrat">Agendar cita →</div>
          </div>
          <div id="s8-wa" style="position:absolute;inset:0;background:#0b141a">
            <div style="background:#1f2c34;padding:40px 24px 22px;display:flex;align-items:center;gap:16px"><div style="width:62px;height:62px;border-radius:50%;background:#fff;display:grid;place-items:center"><img src="assets/img/logo-anisanar.png" style="width:44px" alt=""></div><div style="font:600 28px Montserrat">Anisanar Veterinaria<div data-layout-ignore style="font:400 20px Montserrat;color:#8696a0">en línea</div></div></div>
            <div id="s8-bubble" style="margin:40px 22px 0 auto;width:420px;background:#005c4b;border-radius:26px 6px 26px 26px;padding:24px 28px;font:600 36px/1.3 Montserrat">Quiero agendar una cita 🐾<div data-layout-ignore style="text-align:right;font-size:18px;color:#a7cfc6;margin-top:6px">✓✓</div></div>
          </div>
        </div>
      </div>
    </div>
    ${line('s8', 'l2', [60], 250, { emph: [60], emphCls: 'wa', end: S.s8.end - 0.3 })}`,
  `${whipIn('s8', 'left', 1.1)}
   tl.to('#s8-cam', { scale: 1.02, duration: 2.9, ease: 'power1.out' }, 0.24);
   tl.fromTo('#s8-body', { y: 600, rotation: 6 }, { y: 0, rotation: 0, duration: 0.6, ease: 'expo.out' }, 0.5);
   const u = document.getElementById('s8-url'), url = '${url}';
   [...url].forEach((_, i) => tl.set(u, { textContent: url.slice(0, i + 1) }, ${ty} + i * 0.045));
   tl.set('#s8-wa', { xPercent: 100 }, 0);
   tl.to('#s8-web', { xPercent: -30, duration: 0.4, ease: 'power3.inOut' }, ${wa});
   tl.to('#s8-wa', { xPercent: 0, duration: 0.4, ease: 'power3.inOut' }, ${wa});
   tl.fromTo('#s8-bubble', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)', transformOrigin: '100% 0%' }, ${msg});
   // el celular crece hasta llenar el cuadro: su pantalla da paso al cierre
   tl.to('#s8-body', { scale: 3.4, y: 40, duration: 0.35, ease: 'power3.in' }, ${r3(S.s8.end - s0 - 0.35)});
   tl.to('#s8-cam', { filter: 'blur(16px)', duration: 0.35, ease: 'power2.in' }, ${r3(S.s8.end - s0 - 0.35)});`,
  `.em.ag { font-size: 160px; } .em.wa { font-size: 150px; }`);
}

// S9 · CIERRE — fachada · logo entra · ANISANAR · "cuidamos a tu MEJOR AMIGO" · contacto
files.s9 = scene('s9', `
    ${bgImg('s9', 'assets/img/hero-equipo-veterinario.jpg', '58% 50%')}
    <div class="clip" id="s9-logo" data-start="0.05" data-duration="${r3(DUR - S.s9.start - 0.05)}" style="position:absolute;left:420px;top:250px;width:240px;height:240px">
      <div id="s9-logo-card" style="width:240px;height:240px;border-radius:62px;background:#fff;display:grid;place-items:center;box-shadow:0 30px 80px rgba(0,0,0,.5)"><img src="assets/img/logo-anisanar.png" style="width:176px" alt=""></div>
    </div>
    ${line('s9', 'l1', [61], 540, { html: `<span class="w em white" id="s9-w61" data-t="${r3(t(61) - S.s9.start)}" data-slam="1" style="font-size:150px">ANIS<span style="color:#2BAABC">ANAR</span></span>` })}
    ${line('s9', 'l2', [62, 63, 64], 740)}
    ${line('s9', 'l3', [65, 66], 840, { emph: [65, 66], emphCls: 'amigo' })}
    <div class="clip" id="s9-contact" data-start="${r3(31.0 - S.s9.start)}" data-duration="${r3(DUR - 31.0)}" style="position:absolute;left:0;width:1080px;top:1170px;text-align:center">
      <div class="pill" id="s9-pill1">anisanar.com</div><div class="pill wa" id="s9-pill2">WhatsApp 310 312 04 30</div>
    </div>`,
  `tl.fromTo('#s9-cam', { scale: 1.15, filter: 'blur(12px)' }, { scale: 1.03, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out' }, 0);
   tl.fromTo('#s9-logo-card', { y: 700, rotation: 25, rotationY: -540, transformPerspective: 900, scale: 0.6 }, { y: 0, rotation: 0, rotationY: 0, scale: 1, duration: 0.75, ease: 'expo.out' }, 0.05);
   tl.fromTo('#s9-contact .pill', { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.2, stagger: 0.09, ease: 'power4.out' }, 0.02 + ${r3(31.0 - S.s9.start)});`,
  `.em.amigo { font-size: 175px; }
   .pill { display: inline-block; margin: 10px; padding: 20px 36px; border-radius: 60px; font: 700 40px Montserrat; background: rgba(255,255,255,.12); border: 2px solid rgba(255,255,255,.3); }
   .pill.wa { background: #25D366; border-color: #25D366; color: #06210f; }`);
// (las líneas de S9 no se van: es el cierre)
files.s9 = files.s9.replace("document.querySelectorAll('#root .line').forEach(ln => {", "document.querySelectorAll('#root .line:not([id^=\"s9-\"])').forEach(ln => {");

// ── FX de luz (composición "fx", encima de todo): adaptado de los bloques organic-light-leak y editorial-flash ──
const LEAKS = [{ at: 5.9, d: 1.3 }, { at: 20.45, d: 1.3 }, { at: 27.75, d: 1.1 }];   // puerta · familia→prueba · cierre
const FLASHES = [t(25), t(61)];                                                   // ANISANAR (respuesta) · ANISANAR (marca)
files.fx = `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    #fx-leak { position: absolute; inset: -16%; opacity: 0; overflow: hidden; mix-blend-mode: screen; }
    #fx-leak .lk { position: absolute; inset: -20%; }
    #fx-amber { background: radial-gradient(ellipse 52% 110% at 10% 58%, rgb(255 241 197 / 92%), transparent 45%), radial-gradient(ellipse 72% 120% at 24% 54%, rgb(255 126 57 / 78%), transparent 66%); filter: blur(2.8vmin); }
    #fx-red { background: radial-gradient(ellipse 58% 105% at 78% 34%, rgb(255 120 61 / 40%), rgb(255 90 70 / 14%) 48%, transparent 76%); filter: blur(4vmin); }
    #fx-gold { background: linear-gradient(104deg, transparent 24%, rgb(255 144 62 / 30%) 40%, rgb(255 247 205 / 72%) 51%, rgb(255 124 48 / 22%) 62%, transparent 78%); filter: blur(2vmin); }
    #fx-flash { position: absolute; inset: -12%; }
    #fx-flash .fl { position: absolute; inset: 0; opacity: 0; }
    #fx-wash { background: rgb(255 253 250); }
    #fx-core { inset: -18%; background: radial-gradient(ellipse 68% 92% at 50% 40%, #fff 0%, rgb(255 255 255 / 98%) 20%, rgb(255 253 250 / 86%) 45%, rgb(255 174 105 / 32%) 67%, transparent 86%); mix-blend-mode: screen; }
  </style>
  <div id="root" data-composition-id="fx" data-width="1080" data-height="1920" data-start="0" data-duration="${DUR}">
    <div id="fx-leak" data-layout-ignore><div class="lk" id="fx-amber"></div><div class="lk" id="fx-red"></div><div class="lk" id="fx-gold"></div></div>
    <div id="fx-flash" data-layout-ignore><div class="fl" id="fx-wash"></div><div class="fl" id="fx-core"></div></div>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.set('#fx-leak, #fx-wash, #fx-core', { opacity: 0 }, 0);
    tl.set('#fx-amber, #fx-red, #fx-gold, #fx-core', { xPercent: 0, yPercent: 0, scale: 1, rotation: 0 }, 0);
    ${LEAKS.map(({ at, d }) => `
    tl.fromTo('#fx-leak', { opacity: 0 }, { opacity: 0.5, duration: ${r3(d * 0.24)}, ease: 'sine.out', immediateRender: false }, ${r3(at + d * 0.08)});
    tl.to('#fx-leak', { opacity: 0.22, duration: ${r3(d * 0.2)}, ease: 'sine.inOut' }, ${r3(at + d * 0.42)});
    tl.to('#fx-leak', { opacity: 0, duration: ${r3(d * 0.26)}, ease: 'sine.in' }, ${r3(at + d * 0.68)});
    tl.fromTo('#fx-amber', { xPercent: -20, scale: 0.92, rotation: -4 }, { xPercent: 18, scale: 1.1, rotation: 2, duration: ${d}, ease: 'sine.inOut', immediateRender: false }, ${at});
    tl.fromTo('#fx-red', { xPercent: 20, yPercent: -8, scale: 1.08 }, { xPercent: -16, yPercent: 8, scale: 0.94, duration: ${d}, ease: 'sine.inOut', immediateRender: false }, ${at});
    tl.fromTo('#fx-gold', { xPercent: -28, rotation: -6 }, { xPercent: 24, rotation: 4, duration: ${d}, ease: 'sine.inOut', immediateRender: false }, ${at});`).join('')}
    ${FLASHES.map(h => `
    tl.fromTo('#fx-wash', { opacity: 0 }, { opacity: 0.8, duration: 0.04, ease: 'power4.in', immediateRender: false }, ${r3(h - 0.03)});
    tl.fromTo('#fx-core', { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.05, ease: 'power4.in', immediateRender: false }, ${r3(h - 0.04)});
    tl.to('#fx-wash', { opacity: 0, duration: 0.2, ease: 'power3.out' }, ${r3(h + 0.01)});
    tl.to('#fx-core', { opacity: 0, scale: 1.18, duration: 0.36, ease: 'power2.out' }, ${r3(h + 0.01)});`).join('')}
    window.__timelines["fx"] = tl;
  </script>
</template>
`;

// ── Sonido (raíz): voz, cama y efectos con su pico 1 frame después de la imagen ──
// Criterio de productor: un sonido solo si algo en pantalla lo causa, y del mismo "material" que la marca (aire, golpes
// secos y cortos, interfaz real). Golpe en la palabra que aterriza · aire en cada barrido/corte · interfaz en el celular.
const SFX_PLAN = [];
const take = (fam, n) => `${fam}-${'abc'[n % 3]}`;
let nh = 0, ns = 0;
const hit = (at, vol = 0.42) => SFX_PLAN.push({ name: take('hit', nh++), at, vol });
const swish = (at, vol = 0.26) => SFX_PLAN.push({ name: take('swish', ns++), at, vol });
[t(3), t(8)].forEach(a => hit(a));                          // PERRO, EQUIVOCADA
swish(S.s2.start);                                          // barrido: se descarta la pregunta equivocada
hit(t(16));                                                 // CUIDAR
SFX_PLAN.push({ name: 'zoom-in', at: S.s3.start, vol: 0.34 });  // la cámara atraviesa hacia la puerta
hit(t(25), 0.5);                                            // ANISANAR + logo: el golpe más fuerte, la respuesta
SVC.forEach(v => swish(t(v.w), 0.2));                       // cortes del montaje de servicios (aire leve)
hit(t(36));                                                 // TECHO (el corte oscurecido entra en silencio)
swish(S.s6.start);                                          // barrido vertical al equipo
hit(t(37));                                                 // NUEVE
SFX_PLAN.push({ name: 'pops', at: t(37) + 0.12, vol: 0.3 }); // las 9 caras aparecen en onda
hit(t(45));                                                 // FAMILIA
hit(t(48));                                                 // 9 de cada 10
swish(S.s8.start);                                          // barrido a la agenda
const WA_T = t(57) + 'anisanar.com'.length * 0.045 + 0.04;   // mismo cálculo que la escena 8
SFX_PLAN.push({ name: 'typing', at: t(57), vol: 0.2, raw: true });  // se teclea anisanar.com (arranca con la primera letra)
swish(WA_T, 0.16);                                          // la pantalla pasa a WhatsApp
SFX_PLAN.push({ name: 'message', at: WA_T + 0.32, vol: 0.36 }); // llega el mensaje
hit(t(60), 0.36);                                           // WHATSAPP
SFX_PLAN.push({ name: 'zoom-out', at: S.s9.start, vol: 0.3 }); // atravesamos el celular hacia el cierre
hit(t(61), 0.46);                                           // ANISANAR (la marca)
hit(t(65));                                                 // MEJOR AMIGO
SFX_PLAN.push({ name: 'pop', at: 31.02, vol: 0.26 });       // aparecen los datos de contacto
SFX_PLAN.push({ name: 'sparkle', at: t(25) + 0.12, vol: 0.3 });  // el logo gira y se asienta (respuesta)
SFX_PLAN.push({ name: 'sparkle', at: S.s9.start + 0.5, vol: 0.32 }); // el logo llega girando al cierre
// tecleo: cada palabra conectora suena al escribirse (2 tomas que se alternan); se salta si cae encima de otro efecto
const busy = SFX_PLAN.map(x => x.at);
TICKS.forEach((at, i) => { if (!busy.some(b => Math.abs(b - at) < 0.09)) SFX_PLAN.push({ name: i % 2 ? 'key-a' : 'key-b', at, vol: 0.2 }); });
const Y0 = t(21); [0, 1, 2, 3, 4].forEach(i => SFX_PLAN.push({ name: 'key-a', at: Y0 + i * 0.06, vol: 0.16 }));  // el año gira 1990→2011
const LAG = 1 / 30;
const MIX = 1.35;   // ganancia común de la mezcla (voz, cama y efectos suben juntos)
const laneEnd = Array(8).fill(0);
const sfxTags = SFX_PLAN.sort((a, b) => a.at - b.at).map((s, i) => {
  const p = PEAKS[s.name]; const start = r3(Math.max(0, s.raw ? s.at : s.at + LAG - p.peak));
  let lane = laneEnd.findIndex(e => e <= start); if (lane < 0) lane = laneEnd.indexOf(Math.min(...laneEnd));
  laneEnd[lane] = start + p.dur;
  return `    <audio id="sfx${String(i + 1).padStart(2, '0')}" class="clip" src="assets/sfx/${s.name}.mp3" data-start="${start}" data-duration="${p.dur}" data-track-index="${12 + lane}" data-volume="${r3(s.vol * MIX)}" data-audio-group="sfx"></audio>`;
}).join('\n');
const voiceEnd = W.at(-1).end;
// voz: quitar graves → compresor (suaviza picos, más presencia) → ganancia de compensación → limitador
const VOICE_FX = JSON.stringify({ version: 1, nodes: [
  { type: 'highpass', id: 'v1', label: 'Quitar graves', params: { frequency: 80 } },
  { type: 'compressor', id: 'v2', label: 'Presencia', params: { threshold: -20, ratio: 2.5, attack: 0.005, release: 0.12, knee: 6 } },
  { type: 'gain', id: 'v3', label: 'Compensación', params: { gain: 7 } },
  { type: 'limiter', id: 'v4', label: 'Techo', params: { limit: -1.2 } },
] }).replace(/"/g, '&quot;');
const bedLane = JSON.stringify({ version: 1, lanes: [{ target: 'volume', points: [
  { t: 0, v: r3(0.16 * MIX) }, { t: r3(voiceEnd + 0.2), v: r3(0.16 * MIX) }, { t: r3(voiceEnd + 0.9), v: r3(0.4 * MIX) }] }] }).replace(/"/g, '&quot;');

files.index = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #0b151d; }
      #root { width: 100%; height: 100%; position: relative; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-motion-blur="on" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
${SCENES.map((s, i) => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${r3(s.end - s.start)}" data-track-index="${i % 2}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:${i + 1}"></div>`).join('\n')}
      <div id="fx" data-composition-id="fx" data-composition-src="compositions/fx.html" data-start="0" data-duration="${DUR}" data-track-index="3" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:50"></div>
      <audio id="voice" class="clip" src="assets/voice/narration.mp3" data-start="0" data-track-index="10" data-volume="${MIX}" data-audio-group="voiceover" data-fx-chain="${VOICE_FX}"></audio>
      <audio id="bed" class="clip" src="assets/music/bed.mp3" data-start="0" data-duration="${DUR}" data-media-start="16" data-track-index="11" data-volume="1" data-fade-out="1.2" data-audio-group="music" data-automation="${bedLane}"></audio>
      <!-- SFX: generados desde tools/build.mjs (cada pico 1 frame después de su imagen) -->
${sfxTags}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;

mkdirSync(path.join(root, 'compositions'), { recursive: true });
writeFileSync(path.join(root, 'index.html'), files.index);
rmSync(path.join(root, 'compositions', 'mosaic.html'), { force: true });
for (const s of [...SCENES.map(s => s.id), 'fx']) writeFileSync(path.join(root, 'compositions', `${s}.html`), files[s]);
console.log(`✔ index.html + ${SCENES.length} escenas · ${SFX_PLAN.length} efectos`);

// ── Tratamiento de color oficial (media-treatment) en todos los fondos ──
if (!process.argv.includes('--no-grade')) {
  const BASE = { adjust: { exposure: -0.18, contrast: 0.5, blacks: -0.35, highlights: -0.2, saturation: 0.08 }, details: { vignette: 0.4, grain: 0.04 } };
  const OVERRIDE = { s9: { adjust: { ...BASE.adjust, exposure: -0.75 }, details: BASE.details, effects: { blur: 0.25 } } };
  for (const s of SCENES) {
    const grading = JSON.stringify(OVERRIDE[s.id] ?? BASE);
    // en Windows npx es un .cmd y requiere shell: el JSON va entre comillas con las internas escapadas (\")
    const arg = `"${grading.replace(/"/g, '\\"')}"`;
    execFileSync(`npx -y hyperframes media-treatment --file compositions/${s.id}.html --selector .bg-media --grading ${arg} --apply --json`, { cwd: root, stdio: 'ignore', shell: true });
  }
  console.log('✔ tratamiento de color aplicado a los fondos');
}
