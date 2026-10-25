// Biblioteca de sonido de los videos: efectos y música grabados profesionalmente (Mixkit, Licencia Gratuita:
// uso comercial en redes sociales y publicidad, sin atribución obligatoria — https://mixkit.co/license/).
// La licencia no permite redistribuir los archivos sueltos, así que NO se versionan: `node fetch-sounds.mjs`
// los descarga en sounds/ (ignorado por git). Si faltan, audio.mjs vuelve a los efectos sintetizados.
//
// Paleta "de edición" nítida y moderna, elegida para parecerse a las referencias del cliente (dos TikTok de efectos:
// "Free SFX Vol. 1" y un "SFX reveal"). Cada efecto de las referencias se recortó y se comparó con ~420 sonidos de Mixkit
// por huella acústica (perfil espectral en 20 bandas, ruido/tono, envolvente, duración), dentro de categorías con sentido.
// Paleta v2 (la misma del reel "La pregunta equivocada"): golpes secos y cortos, aire suave en los movimientos, interfaz
// real solo donde hay interfaz, tecleo en el texto que se escribe y un brillo en cada logo. Sin glitch, campanas ni tráiler.
// Los ids "lib-*" son de la biblioteca de HyperFrames (Pixabay, uso comercial libre): fetch-sounds.mjs los copia.
export const SFX = {
  //  tipo de cue   id          ganancia máx.  target = dB que sobresale sobre música+voz (mezcla automática en audio.mjs)
  cut:        { id: 1461, ids: [1461, 1464, 175], gain: 0.50, target: 3 },  // Short wind swoosh / Quick swoosh accent / Short transition sweep
  whoosh:     { id: 1461, gain: 0.50, target: 3 },
  whooshSoft: { id: 1489, gain: 0.38, target: 1.5 },                        // Air woosh — el equipo aparece en onda
  swish:      { id: 1464, gain: 0.45, target: 2.5 },                        // Quick swoosh accent — algo entra rápido / la pantalla se desliza
  swipe:      { id: 175, ids: [175, 1461], gain: 0.36, target: 1.5, rates: [1, 1.04, 0.97] }, // cortes del montaje, más leves
  impact:     { id: 2299, gain: 0.55, target: 5 },                          // Short bass hit — el logo aparece (golpe corto, sin cola)
  hit:        { id: 2299, ids: [2299, 2151, 2161], gain: 0.50, target: 3 }, // golpes secos en frases y en el logo final
  riser:      { id: 2608, gain: 0.40, target: 1, alignEnd: true },          // Air zoom vacuum — aire que sube hacia el logo
  sparkle:    { id: 'lib-sparkle', gain: 0.34, target: 0 },                 // brillo cuando cada logo y la marca se asientan
  pop:        { id: 2364, gain: 0.42, target: 2 },                          // Hard pop click — chips y tarjetas que aterrizan
  key:        { id: 'lib-key-press', ids: ['lib-key-press', 'lib-click-soft'], gain: 0.32, target: -3, rates: [1, 1.06, 0.95] }, // tecleo: cada palabra que se escribe
  count:      { id: 2585, gain: 0.30, target: -1, rates: [1.35] },          // tic digital — un tic por número
  tap:        { id: 1113, gain: 0.45, target: 3 },                          // Mouse click close — toque en pantalla
  click:      { id: 1113, gain: 0.45, target: 1 },
  notify:     { id: 2354, gain: 0.40, target: 3 },                          // Message pop alert — llega el mensaje de WhatsApp
  check:      { id: 2866, gain: 0.26, target: -2 },                         // Digital quick tone — mensaje leído ✓✓
  tick:       { id: 2585, gain: 0.30, target: -2, rates: [1.15] },
  // tipos que solo usa el video de entrega, llevados a la paleta nueva
  glitch:     { id: 2161, gain: 0.45, target: 1 },
  shimmer:    { id: 'lib-sparkle', gain: 0.30, target: -2 },
  chime:      { id: 2364, gain: 0.40, target: 1 },
  success:    { id: 2354, gain: 0.40, target: 1 },
  shutter:    { id: 1431, gain: 0.45, target: 1 },
  flashout:   { id: 1464, gain: 0.45, target: 3 },
};

export const MUSIC = {
  // Motivating Mornings (Mixkit #33): intro suave de ~12 s y "drop" a 11.75 s; 120.88 BPM medidos (video de entrega).
  33: { title: 'Motivating Mornings', bpm: 120.88, drop: 11.751 },
  // Digital Clouds (Mixkit #175, etiqueta "corporate"): tranquila y profesional, ~64 BPM, pocos ataques (≈3/s) y nivel
  // estable. Se usa a su velocidad original (sin forzarla a 120 BPM) desde el inicio, con fundido al final.
  175: { title: 'Digital Clouds', stretch: false, start: 0 },
  // Just Chill (Mixkit #16): relajada con algo más de ritmo, ~94 BPM, la de menos ataques de las candidatas (≈2.6/s).
  16: { title: 'Just Chill', stretch: false, start: 0 },
  // Sleepy Cat (Mixkit #135, lo-fi): ambiente de fondo tipo lounge, ~67 BPM, la más calmada de 18 candidatas
  // (2.4 ataques/s, timbre oscuro, nivel plano sin subidas): se percibe pero no compite con la voz.
  135: { title: 'Sleepy Cat', stretch: false, start: 0 },
  // Lounging By Moonlight (Mixkit #40, jazz lounge): ~69 BPM, intro suave de ~5 s y luego nivel estable.
  40: { title: 'Lounging By Moonlight', stretch: false, start: 0 },
};

export const sfxUrl = id => `https://assets.mixkit.co/active_storage/sfx/${id}/${id}-preview.mp3`;
export const LIB_DIR = '../.agents/skills/media-use/audio/assets/sfx';   // origen de los ids "lib-*"
export const musicUrl = id => `https://assets.mixkit.co/music/${id}/${id}.mp3`;
export const sfxFile = id => `sfx-${id}.mp3`;
export const musicFile = id => `music-${id}.mp3`;
