import sharp from 'sharp';

async function measureExactSlatGeometry() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Slats at x = 130..165 ---');
  for (let x = 130; x <= 165; x += 5) {
    // Top of backrest
    let yTop = -1, yGap1 = -1, yGap2 = -1, ySeatTop = -1, ySeatBottom = -1;
    for (let y = 45; y < 65; y++) {
      if (data[(y * w + x) * 4 + 3] > 100) { yTop = y; break; }
    }
    for (let y = 125; y < 150; y++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      // Check when it transitions to empty air
      if (a < 50 && data[((y-1)*w + x)*4 + 3] > 100) {
        ySeatBottom = y - 1;
        break;
      }
    }
    console.log(`x=${x}: yTop=${yTop}, ySeatBottom=${ySeatBottom}`);
  }
}

measureExactSlatGeometry();
