import sharp from 'sharp';
import fs from 'fs';

async function analyzeBench() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  console.log(`Dimensions: ${w}x${h}`);

  // Inspect column x = 160 from y = 50 to 170
  console.log('--- Column x = 160 ---');
  for (let y = 50; y <= 165; y++) {
    const idx = (y * w + 160) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
    if (a > 10) {
      console.log(`y=${y}: rgba(${r},${g},${b},${a})`);
    } else {
      console.log(`y=${y}: empty`);
    }
  }
}

analyzeBench();
