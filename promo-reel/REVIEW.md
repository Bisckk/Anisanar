# REVIEW — "La pregunta equivocada"

Render: `renders/anisanar-reel.mp4` · 33.5 s · 1080×1920 · −15.7 LUFS · TP −1.7 dBTP · `check`: 0 errores, 0 avisos.
Hojas: `.hyperframes/artifacts/snapshots/69e4b289-…/review-*.jpg` (19 beats, 8 costuras, vista móvil 360 px).

## Decisiones creativas
- Storyline A (elegida). No construidas: B "Un día en Anisanar" (cronológica, sin voz pregunta-respuesta) y C "Habla Toby" (narrador mascota).
- La voz es el reloj: cada palabra de énfasis golpea en el frame en que empieza (words.json de Scribe).
- Acento verde solo en la palabra de énfasis; turquesa solo en mosaico y marca final.
- Sonido: dos familias (impacto en golpes de palabra, whoosh en cortes) + glitch solo en los 2 mosaicos; 0.63 efectos/s; cama 11.8 dB bajo la voz.

## Beats (lo que se ve)
| t | Qué se ve | Nota |
|---|---|---|
| 0.3 / 1.7 | perro real, "¿Qué tiene" / "Esa" arriba | ok, legible en 360 px |
| 3.2–3.6 | EQUIVOCADA → mosaico de marca cubre y revela al equipo | costura limpia |
| 3.7 / 4.75 | equipo quirúrgico, "La pregunta es:", "¿quién" serif | ok |
| 6.4 / 8.3 | puerta real, "En San Gil, desde 2011" | el texto pisa el letrero de la puerta (P2) |
| 10.8 / 12.97 | CONSULTA / LABORATORIO en cortes secos | ok |
| 15.75–16.75 | fachada, UN MISMO TECHO | "UN MISMO" compite con el letrero de la fachada (P2) |
| 17.4 | whip a equipo | 1 frame con banda oscura arriba durante el whip (P2, se lee como movimiento) |
| 17.7 / 19.05 | NUEVE + cuadrícula 3×3 | el subtítulo parcial se ve corrido a la izquierda mientras entran palabras (P2, mismo comportamiento que R1) |
| 21 / 22.4 | golden + doctora, 9/10 | ok, el plano más fuerte |
| 24.35 / 26.05 | AGENDAR, celular teclea anisanar.com | ok |
| 27.85–28.25 | WhatsApp → blur swap → logo + ANISANAR | costura limpia |
| 30.8 | cierre MEJOR AMIGO | ok, se sostiene > 2.5 s |

## Notas
- P0: ninguna.
- P1: ninguna.
- P2: textos sobre letreros reales (s3, s5); frame de whip; subtítulo de s6 descentrado mientras se escribe.
- Plano más débil: s5 (fachada gris y nublada, el letrero real compite con el título).

## Medido, no escuchado
Volúmenes, LUFS, picos y que cada efecto caiga 1 frame después de su imagen se midieron (`hyperframes audio --json`, peaks.json).
El carácter de los efectos y la música no se ha escuchado: eso lo valida el cliente.

## Brecha con las referencias
La voz va a 2.0 palabras/s frente a 2.4 (R1) y 3.6 (R2). Es la mayor diferencia de ritmo; se corrige regenerando la voz más rápida y reconstruyendo (los tiempos salen solos de words.json).

## Revisión 2 (feedback del cliente: "no me gustan los cuadros", "sonidos que no tienen nada que ver")
- Fuera los dos mosaicos y el sonido glitch. Transiciones nuevas, cada una con causa:
  barrido horizontal (3.4 s, se descarta la pregunta equivocada; 24.05 s, hacia la agenda) · zoom a través de la puerta (6.1 s) ·
  cortes secos en cada servicio · corte con oscurecido de 3 frames (15.45 s) · barrido vertical al equipo (17.4 s) ·
  fundido con desenfoque (20.7 s) · el celular crece hasta llenar el cuadro y da paso al cierre (28.05 s).
- Paleta de sonido nueva (Mixkit): golpes cortos y secos en las palabras (sin impactos de tráiler), aire suave en barridos y
  cortes, ráfaga de pops en las 9 caras, tecleo real, "pop" de mensaje de WhatsApp (antes una campana), pop en los contactos.
- Mezcla: −16.3 LUFS, pico real −2.2 dBTP, sin clipping. Medido, no escuchado.
