import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const ROOT = 'public/images';
const COVER_MAX = 600;
const GENERAL_MAX = 1200;
const QUALITY_PHOTO = 80;
const QUALITY_GRAPHIC = 85;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

async function optimize(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, ext);
  const dir = filePath.substring(0, filePath.lastIndexOf('/') || filePath.lastIndexOf('\\'));
  const outPath = join(dir, `${name}.webp`);

  const origStat = await stat(filePath);
  const origKB = Math.round(origStat.size / 1024);

  const isCover = filePath.includes('covers');
  const maxWidth = isCover ? COVER_MAX : GENERAL_MAX;
  const quality = ext === '.png' ? QUALITY_GRAPHIC : QUALITY_PHOTO;

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();
    const pipeline = meta.width > maxWidth ? img.resize({ width: maxWidth, withoutEnlargement: true }) : img;
    await pipeline.webp({ quality }).toFile(outPath);

    const newStat = await stat(outPath);
    const newKB = Math.round(newStat.size / 1024);
    const savings = Math.round((1 - newKB / origKB) * 100);

    console.log(`✅ ${filePath}: ${origKB} KB → ${newKB} KB (−${savings}%)`);
  } catch (err) {
    console.log(`❌ ${filePath}: ${err.message}`);
  }
}

const files = await walk(ROOT);
console.log(`Found ${files.length} images to optimize\n`);

for (const f of files) {
  await optimize(f);
}

console.log('\nDone!');
