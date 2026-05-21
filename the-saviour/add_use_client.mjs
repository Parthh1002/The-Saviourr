import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/components/saviour');

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        fs.writeFileSync(fullPath, '"use client";\n' + content);
      }
    }
  }
}

processDir(dir);
console.log('Added use client to all tsx components.');
