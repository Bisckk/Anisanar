# Video de entrega — Web de Anisanar

Video de 54 s (1920×1080, 30 fps, H.264 + AAC) para presentarle a la veterinaria su nueva página web.
Todo se genera por código: composición HTML + GSAP, render determinista con Chrome headless y banda sonora sintetizada.

```bash
cd promo-video
npm install
npm run voice      # (opcional) locución con ElevenLabs → voice/*.mp3 + voice/lines.json
npm run build      # audio.mjs → soundtrack.wav (música + efectos + voz), luego render.mjs → anisanar-lanzamiento.mp4
```

### Locución (ElevenLabs)

- La clave vive en `../.env.local` (creada con `npx -y @elevenlabs/cli@latest onboard init` desde la raíz; está en `.gitignore`).
- Voz: Bella (premade, cálida y profesional) con el modelo `eleven_v4` en español. Para otra voz, `ELEVEN_VOICE_ID` en
  `.env.local` (`node voice.mjs --voices` lista las disponibles). Las voces de la biblioteca de la comunidad requieren plan de pago.
- El guion está en `SCRIPT` dentro de `voice.mjs`: cada frase tiene su ventana `[t, until]`. Si no cabe, se acelera con
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
