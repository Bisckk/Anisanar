# Efectos de sonido — video para clientes (9:16, 31.5 s)

Versión para revisar solo los efectos: `anisanar-clientes-solo-efectos.mp4` (sin música ni voz; cada efecto a su volumen propio).
Se genera con `node audio.mjs clientes --sfx-only` + `node render.mjs clientes --sfx-only`.

## Criterio

Regla de la skill **HyperFrames** (`.agents/skills/hyperframes/references/sound.md`):
**pocos y exactos — cada efecto tiene una causa en pantalla; demasiados suenan a plantilla.**

| Sonido | Solo en |
|---|---|
| clic | un clic/toque real en pantalla |
| whoosh | un cambio de escena, o una tarjeta grande moviéndose rápido |
| pop | una insignia, chip, número o tarjeta que aterriza |
| riser → impacto | el clímax o la marca, **una vez en todo el video** |

Además: el mismo whoosh nunca dos veces seguidas (3 tomas que se alternan), cada sonido suena 1 fotograma después de su
imagen, y cada golpe queda 3–6 dB por encima de lo que suena debajo.

Los sonidos vienen de las referencias del cliente ([1](https://vt.tiktok.com/ZSgxjAC26/), [2](https://vt.tiktok.com/ZSgxj5Mwd/)),
cada uno buscado en Mixkit (licencia comercial) por parecido acústico, y usado **solo donde tiene sentido**.

## Plan de sonido (17 momentos)

| Seg. | Causa en pantalla | Efecto | Referencia | Escuchar |
|---|---|---|---|---|
| 2.9 → 4.25 | Sube la tensión y aparece el logo con el drop | **Riser → Flash** (clímax, única vez) | "Riser" → "Flash" | [riser](https://assets.mixkit.co/active_storage/sfx/790/790-preview.mp3) · [flash](https://assets.mixkit.co/active_storage/sfx/1340/1340-preview.mp3) |
| 6.05 | Aterriza el chip "Desde 2011" | Click | "Click" | [▶](https://assets.mixkit.co/active_storage/sfx/1137/1137-preview.mp3) |
| 8.0 | Corte: logo → servicios | Whoosh · toma 1 | "Flash" | [▶](https://assets.mixkit.co/active_storage/sfx/1471/1471-preview.mp3) |
| 9.2 · 10.2 · 11.2 · 12.2 · 13.2 | Cortes entre los 6 servicios (Cirugía, Laboratorio, Hospitalización, Fisioterapia, Farmacia) | Whoosh rápido, más sutil; 2 tomas × 3 tonos alternados | "Woosh" | [toma A](https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3) · [toma B](https://assets.mixkit.co/active_storage/sfx/1464/1464-preview.mp3) |
| 14.95 | Corte: servicios → equipo | Whoosh · toma 2 | "Woosh" | [▶](https://assets.mixkit.co/active_storage/sfx/1345/1345-preview.mp3) |
| 15.45 | La foto de la Dra. Carolina entra rápida y grande | Whoosh corto | "Woosh" | [▶](https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3) |
| 16.45 | El equipo aparece en onda desde el centro | Soplo de aire | "Woosh" | [▶](https://assets.mixkit.co/active_storage/sfx/1489/1489-preview.mp3) |
| 16.66 · 16.76 · 16.86 | Aterrizan las fotos del equipo | Click ×3 (ascendente) | "Click x3" | [▶](https://assets.mixkit.co/active_storage/sfx/1137/1137-preview.mp3) |
| 19.15 | Corte: equipo → testimonio | Whoosh · toma 3 | "Flash" | [▶](https://assets.mixkit.co/active_storage/sfx/1468/1468-preview.mp3) |
| 19.6 → 20.45 | El contador sube de 0 a 9 | Conteo digital (un tic por número) | "Digital counting" | [▶](https://assets.mixkit.co/active_storage/sfx/2585/2585-preview.mp3) |
| 23.55 | Corte: testimonio → agenda | Whoosh · toma 1 | "Flash" | [▶](https://assets.mixkit.co/active_storage/sfx/1471/1471-preview.mp3) |
| 25.12 | El dedo toca "Agendar cita" | Clic | "Mouse click" | [▶](https://assets.mixkit.co/active_storage/sfx/1113/1113-preview.mp3) |
| 25.35 | La pantalla se desliza a WhatsApp | Whoosh corto | "Woosh" | [▶](https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3) |
| 25.85 | Llega el mensaje | Notificación | "iPhone notification" | [▶](https://assets.mixkit.co/active_storage/sfx/586/586-preview.mp3) |
| 27.4 | Corte: agenda → cierre | Whoosh · toma 2 | "Woosh" | [▶](https://assets.mixkit.co/active_storage/sfx/1345/1345-preview.mp3) |
| 29.1 | Aterriza la tarjeta de contacto | Click | "Click" | [▶](https://assets.mixkit.co/active_storage/sfx/1137/1137-preview.mp3) |

**Sin efecto, a propósito:** los textos que aparecen (no van letra a letra), las letras de la marca, el doble check, el fundido final. Tampoco hay clics de cámara ni glitches: no hay
ninguna cámara ni ningún glitch en pantalla que los justifique.

## Para cambiar algo

- Todo el plan está junto, comentado, en `clientes.html` (bloque **PLAN DE SONIDO**, al final del timeline).
- Qué archivo suena para cada tipo, y su presencia (`target`): `sounds.mjs`.

## Versión 2 — música tranquila y paleta nueva

- **Música:** *Lounging By Moonlight* (Mixkit #40, jazz lounge, ~69 BPM) a su velocidad original. Queda ~12 dB bajo la voz en las pausas y ~17 dB mientras habla (`under`, `duck` en `window.MUSIC.track`). Antes se probaron *Digital Clouds*, *Just Chill* y *Sleepy Cat*.
  Elegida entre 8 candidatas por ser la de menos ataques por segundo y nivel más estable: tranquila y profesional.
- **Paleta:** la misma del reel (`sounds.mjs`): swooshes de aire en cortes, golpe corto en el logo, aire que sube antes del logo
  (en lugar del riser de tráiler), brillo cuando cada logo se asienta, "pop" de mensaje de WhatsApp (en lugar de la campana)
  y **tecleo suave en cada palabra que se escribe** en pantalla (`typed()` en el plan de sonido de `clientes.html`).
- Mezcla: −14.2 LUFS, pico real −1.2 dBTP, sin clipping.
