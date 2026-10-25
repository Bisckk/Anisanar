# Estudio de las referencias de edición

Referencias del cliente:
- **R1** — [@miftahul_islam_efaz](https://www.instagram.com/reel/Deiz38JJvmv/): motion graphics con personajes pixel/3D, narrado (2:00; estudiado el primer minuto).
- **R2** — [@johnbucog](https://www.instagram.com/reel/DePG8Iquotn/): talking head + B-roll con tipografía cinética alrededor de la persona, narrado (0:35).

Método: hojas de fotogramas con marca de tiempo, transcripción palabra a palabra (ElevenLabs Scribe), medición de niveles
voz/música, detección de cortes de imagen y de efectos fuera de la voz, y clasificación de cada efecto comparándolo con
~420 sonidos de referencia. Vocabulario y criterios: skill HyperFrames (`references/motion.md`, `sound.md`, `story.md`).

## 1. La voz es el reloj

| | R1 | R2 |
|---|---|---|
| Narración | todo el video | todo el video |
| Velocidad | 2.4 palabras/s | 3.6 palabras/s (muy ágil) |
| Estructura | gancho-pregunta → giro ("Wrong question.") → revelación → prueba → CTA ("Comment SKILL") | gancho ("AI video just got even crazier") → contraste ("…generates video? Sure. But… edit? That's new.") → demo → CTA ("Comment MCP") |

Todo lo visual se sincroniza con palabras concretas de la voz: cuando dice "SLOP", aparece SLOP; cuando dice "edit", golpea EDIT.

## 2. Tipografía cinética (lo más característico)

- **Las palabras SON el gráfico.** El texto aparece palabra a palabra al ritmo de la voz, no como subtítulo abajo.
- **Dos jerarquías**: palabras pequeñas en blanco (conectores) y **palabras de énfasis gigantes en color de acento** (rojo en ambas),
  ultra-negrita, ocupando 50-90 % del ancho. Solo 1-2 palabras de énfasis por frase.
- **Mezcla de familias** dentro de una frase (R1): grotesca negrita + serif + manuscrita + monoespaciada/digital.
- **El texto interactúa con la escena** (R2): palabras en **curva alrededor de la cabeza**, palabras **detrás** de la persona
  (profundidad), palabras en 3D girando, palabras **con desenfoque de movimiento y separación RGB** al golpear ("SURE", "THAT'S NEW").
- **Contadores y datos** animados (R1: "40 → 50 kilobytes", binario "00111", barras 38 % → 75 %; R2: "5 tools").
- Las palabras aterrizan y **se quedan quietas**; el movimiento pasa a la siguiente palabra o a la cámara.

## 3. Animación y montaje

- **Planos cortos**: R1 1.7 s de media; R2 3.8 s pero con movimiento constante dentro (texto, cámara).
- **Transición firma (las dos)**: **mosaico de píxeles** — cuadrados de colores sólidos (rojo/blanco/negro) que cubren
  y descubren la imagen en ~0.3-0.5 s.
- Golpes de zoom (punch-in) sobre la palabra clave, cortes en seco en la palabra, barridos (whip) con desenfoque.
- Paleta: imagen **oscura y contrastada** (casi monocroma, cálida) + un acento saturado + blanco. Nada de degradados ni brillos.

## 4. Efectos de sonido

| | R1 | R2 |
|---|---|---|
| Efectos fuera de la voz | 0.8 por segundo | 0.5 por segundo |
| ¿Van en los cortes? | solo 8 de 35 | 5 de 18 |
| ¿Dónde van entonces? | **en las palabras que golpean** y en elementos que entran | igual |

Vocabulario (clasificación acústica de 30 momentos): **solo dos familias que se alternan**:
- **barrido corto / whoosh** (~0.5 s) — movimientos, entradas, cortes;
- **golpe seco corto** ("quick zoom impact", "impact blow") — la palabra grande que golpea;
- puntualmente un **glitch** en la transición de mosaico.

Es decir: pocos tipos de sonido, muy repetidos con variaciones, **atados a la tipografía**, no a la "escena".

## 5. Música

- Volumen total: −13.9 / −14.1 LUFS.
- **La música va ~11 dB por debajo de la voz** (R1); en R2 apenas se distingue bajo voz y efectos.
- Cama discreta, sin melodía protagonista: acompaña, no compite. El protagonismo lo tienen la voz y los golpes.

## 6. Qué tomamos para Anisanar

1. Narración como columna vertebral, ágil (~2.8 palabras/s), con un giro en el gancho.
2. Tipografía cinética sincronizada palabra a palabra: blanco + palabras de énfasis gigantes en **verde de marca**.
3. Texto que interactúa con las fotos/videos reales de la clínica (alrededor del sujeto, detrás, en curva).
4. Transición de **mosaico de píxeles en colores de marca** (verde, turquesa, blanco).
5. Sonido: whoosh + golpe seco alternando 2-3 tomas, sobre las palabras que golpean; glitch solo en el mosaico.
6. Música de cama a ~10-12 dB por debajo de la voz.
7. Imagen real (fotos y videos de la clínica) oscurecida y contrastada para que el texto mande.
