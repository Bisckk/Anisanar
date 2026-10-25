# SPEC — "La pregunta equivocada" (reel de Anisanar)

GOAL:    que un dueño de mascota en San Gil sienta "ya sé quién la va a cuidar" y quiera agendar en anisanar.com / WhatsApp.
OUTPUT:  HyperFrames, 1080 × 1920, 30 fps. Estilo de edición de R1/R2 (`ESTUDIO-referencias.md`).
TIME:    33.5 s × 30 = 1005 frames. La VOZ es el reloj (30.6 s, `assets/voice/words.json`); cada palabra de énfasis
         golpea en pantalla en el frame de su inicio. Música de cama ~11 dB bajo la voz; no marca los cortes.

LOOK:
- Ground: fotos y videos REALES de la clínica a pantalla completa, oscurecidos y contrastados
  (media-treatment: exposición −0.4, contraste +0.25, saturación −0.35, viñeta 0.35, grano 0.04). Nunca un vacío oscuro.
- Ink: blanco #FFFFFF. Accent: verde de marca #8CC63F, SOLO en la palabra de énfasis de cada frase (1–2 por frase).
  Segundo acento turquesa #2BAABC solo en la marca final.
- Display: Montserrat 900, MAYÚSCULAS, tracking −4 %, palabras de énfasis a 150–260 px (60–90 % del ancho).
  Conectores: Montserrat 700, 64–76 px, minúsculas. Una palabra serif de contraste por escena: Playfair Display 900 italic.
  Números digitales: Space Mono 700.
- Golpe de énfasis = separación RGB: sombras −6/+6 px magenta/cian que caen a 0 en 0.25 s. Sin glow, sin brillos.
- Zona útil vertical: todo texto entre y = 168 y y = 1330 px; debajo solo imagen.

OBJECTS: el perro real (video), el equipo quirúrgico real, la puerta real de la clínica con su letrero, las 5 fotos de
servicio, la fachada (techo), las 9 caras del equipo, el golden con la doctora, un celular con la web y el mensaje de
WhatsApp, el logo real.

MOTION:
- Palabra conectora: blur 6 px → 0 y opacidad 0 → 1 en 0.13 s, sin desplazamiento, cada una en su tiempo de voz.
- Palabra de énfasis (slam): escala 1.7 → 1, blur 14 → 0, opacidad 0 → 1 en 0.16 s `expo.out`; queda QUIETA al aterrizar.
- Cámara: punch-in del fondo 1.00 → 1.06 en 0.35 s `power3.out` en cada slam; Ken Burns prohibido en títulos.
- Salidas: blur-out 8 px + fade en 0.15 s. Escalonados: palabras 60–120 ms.
- Transiciones (5 tipos, cada una con causa): barrido horizontal (×2), corte seco en la palabra (montaje), corte con oscurecido, celular que crece hasta el cierre,
  zoom-through (pregunta → puerta), whip vertical (techo → equipo), blur swap (agenda → cierre).

SHOTS (segundos absolutos):
1.  0.00–3.40  HOOK · perro real · "¿Qué tiene mi" + slam PERRO? (0.64) → "esa es la pregunta" + slam EQUIVOCADA (2.48) · golpe×2 · → barrido horizontal
2.  3.40–6.10  PREGUNTA · equipo quirúrgico · "la pregunta es" · "¿quién lo va a" · slam CUIDAR? (5.24) · → zoom-through
3.  6.10–10.50 REVELACIÓN · puerta real · "en San Gil," · contador 2011 · "la respuesta es" · slam ANISANAR (9.60) + logo
4. 10.50–15.45 SERVICIOS · corte seco en cada palabra: Consulta 10.64 · Cirugía 11.46 · Laboratorio 12.22 · Hospitalización 13.24 · Fisioterapia 14.38 · whoosh por corte (3 tomas)
5. 15.45–17.40 TECHO · fachada · "todo bajo" · slam UN MISMO TECHO (16.16) · → whip vertical
6. 17.40–20.70 EQUIPO · slam NUEVE (17.52) + cuadrícula 3×3 de caras · "profesionales que tratan a tu mascota como" · slam FAMILIA (19.92)
7. 20.70–24.05 PRUEBA · golden + doctora · "por eso" · 9 (21.48) "de cada 10 familias nos" · slam RECOMIENDAN (23.16) · → barrido horizontal
8. 24.05–28.05 AGENDA · slam ¿AGENDAR? (24.20) · celular: "anisanar.com" se teclea (25.40) · pasa a WhatsApp, llega el mensaje (27.24) · slam WHATSAPP
9. 28.05–33.50 CIERRE · fachada · logo entra · ANISANAR (28.20) · "cuidamos a tu" · slam MEJOR AMIGO (29.96) · anisanar.com · 310 312 04 30 · sostener ≥ 2.5 s

SOUND: voz al frente; música de cama (Mixkit "Talent in the Air") a volumen 0.16 bajo la voz, sube a 0.4 en el cierre y
se desvanece en 1.2 s; impacto seco en cada slam (3 tomas que rotan), whoosh en cortes y transiciones (3 tomas),
tecleo bajo "anisanar.com", notificación al llegar el mensaje. Cada pico 1 frame después
de su imagen; golpes 3–6 dB sobre la cama; master −14 LUFS, pico ≤ −1 dBTP.

BANNED: vacío oscuro con cosas flotando; glow/partículas/orbes; degradados morados o azules; todo entrando con fade + subida;
texto que se mueve mientras se lee; títulos que siguen derivando tras aterrizar; tres tarjetas en fila; logo pegado en
una esquina; el mismo efecto de sonido dos veces seguidas; "plataforma", "revolucionario", "en segundos".

QA: 0.7 (PERRO aterrizado), 2.6 (EQUIVOCADA), 3.4 (barrido), 5.4 (CUIDAR), 9.8 (ANISANAR + logo),
11.6 / 13.4 (servicios), 16.4 (TECHO), 18.5 (cuadrícula), 20.1 (FAMILIA), 23.4 (RECOMIENDAN), 27.5 (WhatsApp),
31.5 (cierre completo, legible).
