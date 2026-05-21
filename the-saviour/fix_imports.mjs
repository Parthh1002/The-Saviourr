import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/components/saviour');

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace React Router Link with Next.js Link
      content = content.replace(/import\s+\{\s*Link\s*\}\s+from\s+['"]@tanstack\/react-router['"]/g, 'import Link from "next/link"');
      content = content.replace(/<Link\s+to=/g, '<Link href=');

      // Replace image imports: import heroForest from "@/assets/hero-forest.jpg"; -> const heroForest = "/assets/hero-forest.jpg";
      content = content.replace(/import\s+(\w+)\s+from\s+['"]@\/assets\/([^'"]+)['"]/g, 'const $1 = "/assets/$2"');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log('Fixed imports in saviour components.');
