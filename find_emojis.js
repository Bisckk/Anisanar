import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    let filePath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) results.push(...getFiles(filePath));
    else if (filePath.match(/\.(astro|ts)$/)) results.push(filePath);
  });
  return results;
}

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
const files = getFiles('src');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const emojis = content.match(emojiRegex);
  if (emojis) {
    console.log(f + ': ' + Array.from(new Set(emojis)).join(' '));
  }
});
