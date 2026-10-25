// Videos del proyecto. Cada script recibe el id como argumento (por defecto "entrega"):
//   node voice.mjs clientes  ·  node audio.mjs clientes  ·  node render.mjs clientes
export const VIDEOS = {
  // 16:9 · entrega de la web a la clínica
  entrega: { page: 'index.html', out: 'anisanar-lanzamiento.mp4', voiceDir: 'voice' },
  // 9:16 · promoción para clientes y nuevas personas (Reels, TikTok, estados de WhatsApp)
  clientes: { page: 'clientes.html', out: 'anisanar-clientes-vertical.mp4', voiceDir: 'voice-clientes' },
};

export function pickVideo(argv = process.argv.slice(2)) {
  const id = argv.find(a => VIDEOS[a]) || 'entrega';
  return { id, ...VIDEOS[id], cues: `cues-${id}.json`, soundtrack: `soundtrack-${id}.wav` };
}
