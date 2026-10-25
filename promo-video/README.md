# Videos de Anisanar

| Video | Formato | Para qué | Salida |
|---|---|---|---|
| `entrega` | 16:9 · 54 s | Presentarle a la veterinaria su nueva página web | `anisanar-lanzamiento.mp4` |
| `clientes` | 9:16 · 31 s | Promocionar la clínica y la web a clientes y nuevas personas (Reels, TikTok, estados de WhatsApp) | `anisanar-clientes-vertical.mp4` |

Cada script recibe el video como argumento (por defecto `entrega`); la lista está en `videos.mjs`.
El video `clientes` usa fotos y videos **reales** de la clínica (`../public/anisanar/`), sincronizados fotograma a fotograma.
Todo se genera por código: composición HTML + GSAP, render determinista con Chrome headless y banda sonora sintetizada.

```bash
cd promo-video
npm install
node fetch-sounds.mjs      # efectos y música grabados → sounds/ (una vez)
node voice.mjs clientes    # (opcional) locución con ElevenLabs → voice-clientes/*.mp3
node audio.mjs clientes    # música + efectos + voz → soundtrack-clientes.wav
node render.mjs clientes   # → anisanar-clientes-vertical.mp4   (sin argumento: video de entrega)
```

### Sonido

- **Efectos y música grabados** (Mixkit, Licencia Gratuita: uso comercial en redes y publicidad, sin atribución).
  Se descargan con `node fetch-sounds.mjs` en `sounds/` y **no se versionan** (la licencia no permite redistribuir los archivos sueltos).
  Si faltan, `audio.mjs` usa los efectos sintetizados de respaldo.
- Selección en `sounds.mjs`, tras analizar ~35 candidatos por dureza (> 5 kHz), centroide espectral, pegada y ataque.
- **Música** del video `clientes`: *Motivating Mornings*; se recorta y se ajusta a 120 BPM para que su drop caiga en el logo (4.2 s).
- **Mezcla automática por prominencia**: cada efecto se ajusta a cuántos dB debe sobresalir sobre música + voz
  (`target` en `sounds.mjs`), así nunca "estalla" sobre una parte suave. `node audio.mjs clientes --report` lo muestra.
- Master a **-14 LUFS / -1.5 dBTP** con `loudnorm` de 2 pasadas.

### Locución (ElevenLabs)

- La clave vive en `../.env.local` (creada con `npx -y @elevenlabs/cli@latest onboard init` desde la raíz; está en `.gitignore`).
- Voz: Bella (premade, cálida y profesional) con el modelo `eleven_v4` en español. Para otra voz, `ELEVEN_VOICE_ID` en
  `.env.local` (`node voice.mjs --voices` lista las disponibles). Las voces de la biblioteca de la comunidad requieren plan de pago.
- Los guiones están en `SCRIPTS` dentro de `voice.mjs` (uno por video): cada frase tiene su ventana `[t, until]`. Si no cabe, se acelera con
  `atempo` (sin cambiar el tono, máx. x1.18). Solo se regeneran las frases cuyo texto cambia.
- Bajo la voz, la música baja ~6 dB y los efectos ~2.5 dB automáticamente.
- Licencia: el plan gratuito de ElevenLabs no permite uso comercial; para entregar el video a un cliente, usa un plan de pago.

- `node render.mjs --stills 10,22.5` — PNGs de fotogramas sueltos en `frames/` para revisar.
- `index.html?play` — vista previa en tiempo real en el navegador (sin audio).
- `CHROME_PATH` permite apuntar a otro Chrome/Chromium.

## Guion

| Tiempo | Escena | Mensaje |
|---|---|---|
| 0–4.4 | Gancho | "23:47 — La clínica está cerrada. Pero tu web sigue atendiendo." |
|  |  | *La locución completa, frase a frase y con tiempos, está en `SCRIPT` de `voice.mjs`.* |
| 4.4–8.5 | Logo | ANISANAR · "Presentamos tu nueva página web" |
| 8.3–14.2 | 01 Inicio | "Tu clínica, a primera vista." — identidad, responsive, cifras |
| 14–21 | 02 Servicios | "Tus servicios, cada uno con su página." — detalle de Vacunación + resultado en Google |
| 21–25.6 | 03 Equipo | "Tu equipo, presentado como merece." |
| 25.4–36 | 04 Citas online | Reserva en 3 pasos a las 23:52 → "Y la solicitud te llega al instante" por WhatsApp |
| 36–42.8 | Beneficios | "Lo que tu web hace por ti" — 6 ventajas |
| 42.6–47.2 | 05 Reseñas | 4.9 ★ — "Lo que dicen tus pacientes" |
| 47–54 | Cierre | "Tu nueva web ya está en línea." · anisanar.com |

## Notas técnicas

- **Clics sincronizados:** los toques en el móvil apuntan al centro real de cada botón (`at()` mide el layout cuando
  GSAP inicializa el tween, ya con fuentes cargadas). Cada toque muestra un anillo y suena en el mismo frame.
- **Audio:** los efectos se leen de `cues.json`, exportado por la misma timeline, así que cualquier cambio de tiempos
  en `index.html` se refleja solo en el audio al hacer `npm run build`. Paleta cálida y sutil, nivel ≈ -16 LUFS.
- **Movimiento** (skill `motion-design`): personalidad Premium; entradas `expo.out`, salidas `power3.in`,
  cámara `power3.inOut`; capas principal, secundaria y de ambiente.
