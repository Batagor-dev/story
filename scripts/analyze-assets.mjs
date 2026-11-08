import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = [
  'public/assets/karakter/karakter_cowo.jpeg',
  'public/assets/karakter/karakter_cewe.jpeg',
  'public/assets/componet/bunga.jpeg',
  'public/assets/componet/buklet_bungan.jpeg',
  'public/assets/componet/bulble_chat.jpeg',
  'public/assets/componet/button.jpeg',
  'public/assets/componet/pohon.jpeg',
  'public/assets/componet/semak.jpeg'
];

async function run() {
  for (const f of files) {
    if (fs.existsSync(f)) {
      const meta = await sharp(f).metadata();
      const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
      // Sample top-left pixel (usually checkerboard background)
      const r = data[0], g = data[1], b = data[2];
      // Sample 30 pixels across to see checkerboard pattern
      const sample = [];
      for (let x = 0; x < 50; x += 10) {
        const idx = (0 * info.width + x) * info.channels;
        sample.push(`(${data[idx]},${data[idx+1]},${data[idx+2]})`);
      }
      console.log(`${f}: ${meta.width}x${meta.height}, channels=${meta.channels}, sample top row: ${sample.join(' ')}`);
    } else {
      console.log(`Not found: ${f}`);
    }
  }
}

run();
