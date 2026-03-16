import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const ASSETS_DIR = new URL('../src/assets', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const files = readdirSync(ASSETS_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(ASSETS_DIR, file);
  const ext = extname(file).toLowerCase();
  const sizeBefore = statSync(filePath).size;
  totalBefore += sizeBefore;

  const outPath = filePath; // overwrite in place
  const tmpPath = filePath + '.tmp';

  try {
    if (ext === '.png') {
      await sharp(filePath).png({ quality: 80, compressionLevel: 9 }).toFile(tmpPath);
    } else {
      // jpg/jpeg
      await sharp(filePath).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(tmpPath);
    }

    const sizeAfter = statSync(tmpPath).size;
    totalAfter += sizeAfter;

    // Replace original only if compressed is smaller
    if (sizeAfter < sizeBefore) {
      unlinkSync(filePath);
      const { renameSync } = await import('fs');
      renameSync(tmpPath, outPath);
      console.log(`✅ ${file}: ${(sizeBefore/1024).toFixed(0)}KB → ${(sizeAfter/1024).toFixed(0)}KB (-${(100*(1-sizeAfter/sizeBefore)).toFixed(0)}%)`);
    } else {
      unlinkSync(tmpPath);
      console.log(`⏭  ${file}: already optimized, skipped`);
      totalAfter -= sizeAfter;
      totalAfter += sizeBefore;
    }
  } catch (e) {
    console.error(`❌ ${file}: ${e.message}`);
    try { unlinkSync(tmpPath); } catch {}
    totalAfter += sizeBefore - sizeBefore; // no change
  }
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB`);
