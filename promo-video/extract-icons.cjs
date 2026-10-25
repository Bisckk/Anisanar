// Extrae los iconNode de lucide-react (dependencia del sitio) a assets/icons.js
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'node_modules', 'lucide-react', 'dist', 'esm', 'icons');
const names = ['stethoscope','syringe','microscope','activity','apple','cross','clock','moon','calendar-check',
  'message-circle','search','smartphone','star','shield-check','zap','users','trending-up','check','dog','cat',
  'rabbit','send','globe','bell','heart-pulse','phone-off','sparkles','arrow-right','map-pin','bed',
  'scissors','flask-conical','pill','shopping-bag','quote','paw-print','heart','phone','hand-heart','store'];
const out = {};
for (const n of names) {
  const src = fs.readFileSync(path.join(dir, n + '.js'), 'utf8');
  const node = eval(src.match(/const __iconNode = (\[[\s\S]*?\]);/)[1]);
  out[n] = node.map(([tag, a]) => `<${tag} ${Object.entries(a).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
}
fs.writeFileSync(path.join(__dirname, 'assets', 'icons.js'), 'window.ICONS = ' + JSON.stringify(out, null, 0) + ';\n');
console.log(Object.keys(out).length, 'icons');
